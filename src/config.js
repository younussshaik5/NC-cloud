// ========================================
// Application Configuration & Env Injection
// ========================================
// This file is designed to be replaced or injected during CI/CD deployment.

window.APP_CONFIG = {
    // 1. OpenRouter API (Primary AI)
    OPENROUTER_API_KEY: (() => {
        const secret = window.ENV?._AI_MASTER_K || "";
        if (!secret) return window.ENV?.OPENROUTER_API_KEY || "";
        try {
            // Decode Base64 then Reverse string back to original
            return atob(secret).split('').reverse().join('');
        } catch (e) {
            return "";
        }
    })(),
    OPENROUTER_MODEL: window.ENV?.OPENROUTER_MODEL || "google/gemma-3-27b-it:free",
    OPENROUTER_MULTIMODAL_MODEL: window.ENV?.OPENROUTER_MULTIMODAL_MODEL || "nvidia/nemotron-nano-12b-v2-vl:free",
    OPENROUTER_MULTIMODAL_SECONDARY_MODEL: window.ENV?.OPENROUTER_MULTIMODAL_SECONDARY_MODEL || "google/gemini-2.5-flash-lite",
    OPENROUTER_MULTIMODAL_TERTIARY_MODEL: window.ENV?.OPENROUTER_MULTIMODAL_TERTIARY_MODEL || "google/gemini-2.5-flash-lite",

    // 2. Netcore Cloud API
    NETCORE_CE_API_KEY: window.ENV?.NETCORE_CE_API_KEY || "",
    NETCORE_EMAIL_API_KEY: window.ENV?.NETCORE_EMAIL_API_KEY || "",
    NETCORE_PANEL_URL: window.ENV?.NETCORE_PANEL_URL || "",

    // 3. Proxy Server URL
    PROXY_URL: ""
};

// Try to load from standard env vars if using a bundler (Vite/Webpack) - optional
if (typeof process !== 'undefined' && process.env) {
    if (process.env.OPENROUTER_API_KEY) window.APP_CONFIG.OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
}

console.log("APP_CONFIG Loaded:", window.APP_CONFIG);
