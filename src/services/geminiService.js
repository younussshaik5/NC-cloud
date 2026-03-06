// ========================================
// AI Service (Powered by OpenRouter)
// Dual Model: Text + Multimodal (Vision)
// ========================================

const GeminiService = {
    openRouterKey: null,
    openRouterModel: null,
    multimodalModel: null,
    secondaryMultimodalModel: null,
    tertiaryMultimodalModel: null,

    init() {
        this.openRouterKey = localStorage.getItem('openrouter_api_key') || window.APP_CONFIG?.OPENROUTER_API_KEY || null;
        this.openRouterModel = localStorage.getItem('openrouter_model') || window.APP_CONFIG?.OPENROUTER_MODEL || 'google/gemma-3-27b-it:free';
        this.multimodalModel = localStorage.getItem('openrouter_multimodal_model') || window.APP_CONFIG?.OPENROUTER_MULTIMODAL_MODEL || 'nvidia/nemotron-nano-12b-v2-vl:free';
        this.secondaryMultimodalModel = localStorage.getItem('openrouter_multimodal_secondary_model') || window.APP_CONFIG?.OPENROUTER_MULTIMODAL_SECONDARY_MODEL || 'google/gemini-2.5-flash-lite';
        this.tertiaryMultimodalModel = localStorage.getItem('openrouter_multimodal_tertiary_model') || window.APP_CONFIG?.OPENROUTER_MULTIMODAL_TERTIARY_MODEL || 'google/gemini-2.5-flash-lite';

        console.log("[AI] Service Initialized with OpenRouter.");
    },

    setOpenRouterKey(key) {
        this.openRouterKey = key;
        localStorage.setItem('openrouter_api_key', key);
        if (window.APP_CONFIG) window.APP_CONFIG.OPENROUTER_API_KEY = key;
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

        const groundingPrompt = `
CROSS-CHECK & GROUNDING INSTRUCTIONS:
1. You MUST cross-check all facts with official internet documentation, product guides, and reputable articles.
2. If citing Netcore Cloud products, refer to official help articles or developer documentation.
3. PROVIDE SOURCE CITATIONS if possible (e.g., [Source: Netcore Cloud Docs]).
4. STRUCTURE: Use Markdown tables for any comparative data or lists where appropriate.
5. If unsure about a fact, state that it needs verification from official sources.
`;
        const unifiedSystemInstruction = (systemInstruction ? systemInstruction + "\n" : "") + groundingPrompt;

        const makeRequest = async (model) => {
            const hasAttachments = attachments?.length > 0;
            const messages = [];
            if (unifiedSystemInstruction) messages.push({ role: 'system', content: unifiedSystemInstruction });

            let userContent = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);

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

            console.log(`[AI] Attempting request with model: ${model}`);

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openRouterKey.trim()}`,
                    'Content-Type': 'application/json',
                    'X-Title': 'NC Workstation'
                },
                body: JSON.stringify({
                    model,
                    messages,
                    temperature: 0.7
                }),
                signal: AbortSignal.timeout(60000)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content || '';

            if (!text) throw new Error('Empty response from AI');

            return { success: true, text, source: 'openrouter', model };
        };

        const retryChain = [
            this.openRouterModel,
            this.multimodalModel,
            this.secondaryMultimodalModel,
            this.tertiaryMultimodalModel,
            'google/gemini-2.5-flash-lite'
        ].filter(Boolean);

        const uniqueChain = [...new Set(retryChain)];
        let lastError = null;
        let attemptedModels = [];

        for (const modelToTry of uniqueChain) {
            try {
                attemptedModels.push(modelToTry);
                return await makeRequest(modelToTry);
            } catch (error) {
                console.error(`[AI] Model ${modelToTry} failed:`, error.message);
                lastError = error;
            }
        }

        return {
            success: false,
            error: `AI Generation Failed via OpenRouter. 
Attempts: ${attemptedModels.join(' -> ')}
Last Error: ${lastError?.message || 'Unknown error'}`
        };
    }
};

GeminiService.init();
export default GeminiService;
