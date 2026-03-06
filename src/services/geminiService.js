// ========================================
// AI Service (Powered by OpenRouter)
// Dual Model: Text + Multimodal (Vision)
// ========================================

const GeminiService = {
    openRouterKey: null,
    openRouterModel: null,
    multimodalModel: null,

    init() {
        this.openRouterKey = localStorage.getItem('openrouter_api_key') || window.APP_CONFIG?.OPENROUTER_API_KEY || null;
        this.openRouterModel = localStorage.getItem('openrouter_model') || window.APP_CONFIG?.OPENROUTER_MODEL || 'google/gemma-3-27b-it:free';
        this.multimodalModel = localStorage.getItem('openrouter_multimodal_model') || window.APP_CONFIG?.OPENROUTER_MULTIMODAL_MODEL || 'nvidia/nemotron-nano-12b-v2-vl:free';
        this.secondaryMultimodalModel = localStorage.getItem('openrouter_multimodal_secondary_model') || window.APP_CONFIG?.OPENROUTER_MULTIMODAL_SECONDARY_MODEL || 'google/gemini-2.5-flash-lite';
        this.tertiaryMultimodalModel = localStorage.getItem('openrouter_multimodal_tertiary_model') || window.APP_CONFIG?.OPENROUTER_MULTIMODAL_TERTIARY_MODEL || 'google/gemini-2.5-flash-lite';
    },

    setOpenRouterKey(key) {
        this.openRouterKey = key;
        localStorage.setItem('openrouter_api_key', key);
        if (window.APP_CONFIG) window.APP_CONFIG.OPENROUTER_API_KEY = key;
    },

    setOpenRouterModel(model) {
        this.openRouterModel = model;
        localStorage.setItem('openrouter_model', model);
        if (window.APP_CONFIG) window.APP_CONFIG.OPENROUTER_MODEL = model;
    },

    setMultimodalModel(model) {
        this.multimodalModel = model;
        localStorage.setItem('openrouter_multimodal_model', model);
        if (window.APP_CONFIG) window.APP_CONFIG.OPENROUTER_MULTIMODAL_MODEL = model;
    },

    setSecondaryMultimodalModel(model) {
        this.secondaryMultimodalModel = model;
        localStorage.setItem('openrouter_multimodal_secondary_model', model);
        if (window.APP_CONFIG) window.APP_CONFIG.OPENROUTER_MULTIMODAL_SECONDARY_MODEL = model;
    },

    setTertiaryMultimodalModel(model) {
        this.tertiaryMultimodalModel = model;
        localStorage.setItem('openrouter_multimodal_tertiary_model', model);
        if (window.APP_CONFIG) window.APP_CONFIG.OPENROUTER_MULTIMODAL_TERTIARY_MODEL = model;
    },

    isLiveMode() {
        return !!(this.openRouterKey || window.APP_CONFIG?.OPENROUTER_API_KEY);
    },

    async generateContent(prompt, systemInstruction = '', attachments = [], tools = []) {
        const openRouterKey = this.openRouterKey || window.APP_CONFIG?.OPENROUTER_API_KEY;

        if (!openRouterKey) {
            return {
                success: false,
                error: 'No AI Provider Configured. Please add an OpenRouter API key in Settings.'
            };
        }

        // Inject Grounding & Structure Instructions
        const groundingPrompt = `
CROSS-CHECK & GROUNDING INSTRUCTIONS:
1. You MUST cross-check all facts with official internet documentation, product guides, and reputable articles.
2. If citing Netcore Cloud products, refer to official help articles or developer documentation.
3. PROVIDE SOURCE CITATIONS if possible (e.g., [Source: Netcore Cloud Docs]).
4. STRUCTURE: Use Markdown tables for any comparative data or lists where appropriate. Ensure outputs are highly structured and professional.
5. If unsure about a fact, state that it needs verification from official sources.
`;
        const unifiedSystemInstruction = (systemInstruction ? systemInstruction + "\n" : "") + groundingPrompt;

        const makeRequest = async (model) => {
            const hasAttachments = attachments?.length > 0;
            const messages = [];
            if (unifiedSystemInstruction) messages.push({ role: 'system', content: unifiedSystemInstruction });

            // OpenRouter/OpenAI style messages
            let userContent = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);

            // Handle attachments — support image, audio, video, and PDF
            if (hasAttachments) {
                const contentParts = [{ type: 'text', text: userContent }];
                attachments.forEach(file => {
                    if (file.mimeType.startsWith('image/')) {
                        contentParts.push({
                            type: 'image_url',
                            image_url: { url: `data:${file.mimeType};base64,${file.data}` }
                        });
                    } else if (file.mimeType.startsWith('audio/')) {
                        contentParts.push({
                            type: 'input_audio',
                            input_audio: { data: file.data, format: file.mimeType.split('/')[1] }
                        });
                    } else {
                        // For PDFs and other files, use OpenRouter's file structure
                        contentParts.push({
                            type: 'file',
                            file: { data: file.data, mime_type: file.mimeType }
                        });
                    }
                });
                messages.push({ role: 'user', content: contentParts });
            } else {
                messages.push({ role: 'user', content: userContent });
            }

            console.log(`[AI] Using model: ${model}${hasAttachments ? ' (multimodal detected)' : ' (text)'}`);

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openRouterKey}`,
                    'Content-Type': 'application/json',
                    'X-Title': 'NC Workstation'
                },
                body: JSON.stringify({
                    model,
                    messages
                }),
                signal: AbortSignal.timeout(60000)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || response.status);
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content || '';
            return { success: true, text, source: 'openrouter', model };
        };

        // Chain of models to try (All via OpenRouter)
        const retryChain = [
            this.openRouterModel,
            this.multimodalModel,
            this.secondaryMultimodalModel,
            this.tertiaryMultimodalModel,
            'google/gemini-2.5-flash-lite' // Mandatory paid fallback via OpenRouter
        ];

        // Deduplicate and filter out empty strings/nulls
        const uniqueChain = [...new Set(retryChain)].filter(Boolean);

        let lastError = null;
        let attemptedModels = [];

        for (const modelToTry of uniqueChain) {
            try {
                attemptedModels.push(modelToTry);
                if (attemptedModels.length > 1) {
                    console.warn(`[AI] Attempting OpenRouter fallback to ${modelToTry}...`);
                }
                return await makeRequest(modelToTry);
            } catch (error) {
                console.error(`[AI] OpenRouter Model ${modelToTry} failed:`, error.message);
                lastError = error;
                // Continue to next model in chain regardless of error type
            }
        }

        return {
            success: false,
            error: `AI Generation Failed via OpenRouter. 
Attempts: ${attemptedModels.join(' -> ')}
Last Error: ${lastError?.message}`
        };
    }
};

GeminiService.init();

export default GeminiService;
