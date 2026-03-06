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
        const hardcodedKey = window.APP_CONFIG?.OPENROUTER_API_KEY;
        const savedKey = localStorage.getItem('openrouter_api_key');

        // Prioritize hardcoded key to "update everywhere" as requested
        this.openRouterKey = hardcodedKey || savedKey || null;

        this.openRouterModel = window.APP_CONFIG?.OPENROUTER_MODEL || localStorage.getItem('openrouter_model') || 'google/gemma-3-27b-it:free';
        this.multimodalModel = window.APP_CONFIG?.OPENROUTER_MULTIMODAL_MODEL || localStorage.getItem('openrouter_multimodal_model') || 'nvidia/nemotron-nano-12b-v2-vl:free';
        this.secondaryMultimodalModel = window.APP_CONFIG?.OPENROUTER_MULTIMODAL_SECONDARY_MODEL || localStorage.getItem('openrouter_multimodal_secondary_model') || 'google/gemini-2.5-flash-lite';
        this.tertiaryMultimodalModel = window.APP_CONFIG?.OPENROUTER_MULTIMODAL_TERTIARY_MODEL || localStorage.getItem('openrouter_multimodal_tertiary_model') || 'google/gemini-2.5-flash-lite';

        const maskedKey = this.openRouterKey ? `${this.openRouterKey.substring(0, 10)}...${this.openRouterKey.substring(this.openRouterKey.length - 4)}` : 'MISSING';
        console.log(`[AI] Service Initialized. Key: ${maskedKey}`);
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

        const maskedKey = openRouterKey ? `${openRouterKey.substring(0, 10)}...${openRouterKey.substring(openRouterKey.length - 4)}` : 'MISSING';

        return {
            success: false,
            error: `AI Generation Failed via OpenRouter. 
Attempts: ${attemptedModels.join(' -> ')}
Last Error: ${lastError?.message || 'Unknown error'}
Active Key: ${maskedKey}`
        };
    }
};

GeminiService.init();
export default GeminiService;
