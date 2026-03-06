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
        this.googleAIKey = localStorage.getItem('google_ai_key') || window.APP_CONFIG?.GOOGLE_AI_KEY || null;
    },

    setGoogleAIKey(key) {
        this.googleAIKey = key;
        localStorage.setItem('google_ai_key', key);
        if (window.APP_CONFIG) window.APP_CONFIG.GOOGLE_AI_KEY = key;
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

        const makeGoogleRequest = async (prompt, attachments) => {
            const googleKey = this.googleAIKey || window.APP_CONFIG?.GOOGLE_AI_KEY;
            if (!googleKey) throw new Error('No Google AI Key for backup');

            console.log(`[AI] Attempting Safety Fallback: Native Google Gemini...`);

            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleKey}`;

            const contents = [];
            const parts = [{ text: typeof prompt === 'string' ? prompt : JSON.stringify(prompt) }];

            if (attachments?.length > 0) {
                attachments.forEach(file => {
                    parts.push({
                        inlineData: {
                            mimeType: file.mimeType,
                            data: file.data
                        }
                    });
                });
            }

            contents.push({ parts });

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    systemInstruction: { parts: [{ text: unifiedSystemInstruction }] }
                }),
                signal: AbortSignal.timeout(30000)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Google AI Error: ${errorData.error?.message || response.status}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            return { success: true, text, source: 'google-native', model: 'gemini-1.5-flash' };
        };

        const primaryModel = this.openRouterModel || 'google/gemma-3-27b-it:free';
        const multimodal1 = this.multimodalModel || 'nvidia/nemotron-nano-12b-v2-vl:free';
        const multimodal2 = this.secondaryMultimodalModel || 'google/gemini-2.5-flash-lite';
        const multimodal3 = this.tertiaryMultimodalModel || 'google/gemini-2.5-flash-lite';

        // Chain of models to try (All via OpenRouter)
        // We always include the paid 'google/gemini-2.5-flash-lite' as the reliable fallback
        const retryChain = [
            this.openRouterModel,
            this.multimodalModel,
            this.secondaryMultimodalModel,
            this.tertiaryMultimodalModel,
            'google/gemini-2.5-flash-lite' // Mandatory paid fallback
        ];

        // Deduplicate and filter out empty strings/nulls
        const uniqueChain = [...new Set(retryChain)].filter(Boolean);

        let lastError = null;
        let attemptedModels = [];

        for (const modelToTry of uniqueChain) {
            try {
                attemptedModels.push(modelToTry);
                if (attemptedModels.length > 1) {
                    console.warn(`[AI] Attempting fallback to ${modelToTry}...`);
                }
                return await makeRequest(modelToTry);
            } catch (error) {
                console.error(`[AI] Model ${modelToTry} failed:`, error.message);
                lastError = error;
                // We DON'T break anymore, even on "User not found" or "Unauthorized", 
                // because different models on OpenRouter might have different provider permissions.
            }
        }

        // Final Safety Fallback: Native Google Gemini (using direct API key if available)
        try {
            return await makeGoogleRequest(prompt, attachments);
        } catch (backupError) {
            console.error(`[AI] Primary chain and Safety Fallback failed.`);
            return {
                success: false,
                error: `AI Generation Failed. 
Attempts: ${attemptedModels.join(' -> ')} -> Native Gemini.
Last OpenRouter Error: ${lastError?.message}
Stack: ${backupError.message}`
            };
        }
    }
};

GeminiService.init();

export default GeminiService;
