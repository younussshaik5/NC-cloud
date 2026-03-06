// ========================================
// Settings — Netcore Cloud Workstation
// ========================================

import GeminiService from '../services/geminiService.js';
import NetcoreService from '../services/netcoreService.js';
import SlackService from '../services/slackService.js';

const Settings = {
    render() {
        const ncConnected = NetcoreService.isConnected();
        const aiConnected = GeminiService.isLiveMode?.() || false;
        const slackConnected = SlackService.getWebhookUrl?.() || false;

        return `
        <div class="module-page">
            <div class="module-header">
                <h1>⚙️ Settings</h1>
                <p class="module-desc">Configure AI providers, Netcore Cloud API, and integrations.</p>
            </div>

            <div style="max-width:700px;">
                <!-- Netcore Cloud -->
                <div class="glass-card" style="padding:var(--space-6); margin-bottom:var(--space-6);">
                    <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-4);">
                        <span style="font-size:24px;">⚡</span>
                        <div>
                            <h2 style="margin:0;">Netcore Cloud</h2>
                            <span style="font-size:var(--font-sm); color:${ncConnected ? '#34d399' : '#6b7280'};">
                                ${ncConnected ? '🟢 Connected' : '⚪ Not Connected'}
                            </span>
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-3)">
                        <label class="form-label">CE API Key</label>
                        <input id="set-nc-api" class="form-input" type="password" placeholder="Your Netcore CE API key" value="${NetcoreService.getApiKey() || ''}" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-3)">
                        <label class="form-label">Email API Key (optional)</label>
                        <input id="set-nc-email" class="form-input" type="password" placeholder="Netcore Email API key" value="${NetcoreService.getEmailApiKey() || ''}" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Panel URL (optional)</label>
                        <input id="set-nc-panel" class="form-input" placeholder="https://your-panel.netcorecloud.net" value="${NetcoreService.getPanelUrl() || ''}" />
                    </div>
                    <div style="display:flex; gap:var(--space-2);">
                        <button class="btn btn-primary" onclick="Settings.saveNetcore()">💾 Save</button>
                        <button class="btn btn-secondary" onclick="Settings.testNetcore()">🧪 Test</button>
                        <button class="btn btn-secondary" onclick="Settings.clearNetcore()">🗑️ Clear</button>
                    </div>
                </div>

                <!-- AI Providers -->
                <div class="glass-card" style="padding:var(--space-6); margin-bottom:var(--space-6);">
                    <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-4);">
                        <span style="font-size:24px;">🤖</span>
                        <div>
                            <h2 style="margin:0;">AI Providers</h2>
                            <span style="font-size:var(--font-sm); color:${aiConnected ? '#34d399' : '#6b7280'};">
                                ${aiConnected ? '🟢 AI Ready' : '⚪ AI Unconfigured'}
                            </span>
                        </div>
                    </div>

                    <h3 style="color:var(--text-secondary); margin-bottom:var(--space-3);">OpenRouter (Primary)</h3>
                    <div class="form-group" style="margin-bottom:var(--space-3)">
                        <label class="form-label">API Key</label>
                        <input id="set-or-key" class="form-input" type="password" placeholder="sk-or-..." value="${localStorage.getItem('openrouter_api_key') || ''}" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-3)">
                        <label class="form-label">Text Model</label>
                        <input id="set-or-model" class="form-input" placeholder="google/gemma-3-27b-it:free" value="${localStorage.getItem('openrouter_model') || ''}" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Multimodal Model</label>
                        <input id="set-or-mm" class="form-input" placeholder="nvidia/nemotron-nano-12b-v2-vl:free" value="${localStorage.getItem('openrouter_multimodal_model') || ''}" />
                    </div>

                    <div style="display:flex; gap:var(--space-2); flex-wrap:wrap;">
                        <button class="btn btn-primary" onclick="Settings.saveAI()">💾 Save AI Settings</button>
                        <button class="btn btn-secondary" onclick="Settings.testAI()">🧪 Test AI</button>
                        <button class="btn btn-secondary" onclick="Settings.resetAI()" title="Clear local key and use hardcoded default">🔄 Reset to Default</button>
                    </div>
                </div>

                <!-- Slack -->
                <div class="glass-card" style="padding:var(--space-6); margin-bottom:var(--space-6);">
                    <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-4);">
                        <span style="font-size:24px;">💬</span>
                        <div>
                            <h2 style="margin:0;">Slack Integration</h2>
                            <span style="font-size:var(--font-sm); color:${slackConnected ? '#34d399' : '#6b7280'};">
                                ${slackConnected ? '🟢 Connected' : '⚪ Not Connected'}
                            </span>
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Webhook URL</label>
                        <input id="set-slack" class="form-input" type="password" placeholder="https://hooks.slack.com/..." value="${localStorage.getItem('slack_webhook') || ''}" />
                    </div>
                    <button class="btn btn-primary" onclick="Settings.saveSlack()">💾 Save</button>
                </div>

                <!-- Proxy Server -->
                <div class="glass-card" style="padding:var(--space-6);">
                    <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-4);">
                        <span style="font-size:24px;">🔗</span>
                        <div>
                            <h2 style="margin:0;">Proxy Server</h2>
                            <span style="font-size:var(--font-sm); color:var(--text-secondary);">Optional — for bypassing CORS</span>
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Proxy URL</label>
                        <input id="set-proxy" class="form-input" placeholder="http://localhost:3000/api/proxy" value="${localStorage.getItem('proxy_url') || ''}" />
                    </div>
                    <button class="btn btn-primary" onclick="Settings.saveProxy()">💾 Save</button>
                </div>
            </div>
        </div>`;
    },

    init() { },

    saveNetcore() {
        const apiKey = document.getElementById('set-nc-api').value.trim();
        const emailKey = document.getElementById('set-nc-email').value.trim();
        const panel = document.getElementById('set-nc-panel').value.trim();

        if (apiKey) localStorage.setItem('netcore_ce_api_key', apiKey);
        if (emailKey) localStorage.setItem('netcore_email_api_key', emailKey);
        if (panel) localStorage.setItem('netcore_panel_url', panel);

        if (NetcoreService.init) NetcoreService.init();
        window.App.showToast('Netcore Cloud credentials saved!', 'success');
    },

    async testNetcore() {
        if (!NetcoreService.isConnected()) {
            window.App.showToast('Save credentials first', 'warning');
            return;
        }

        window.App.showToast('Testing connection...', 'info');
        const success = await NetcoreService.testConnection();

        if (success) {
            window.App.showToast('✅ Connected to Netcore Cloud!', 'success');
        } else {
            window.App.showToast('❌ Connection failed — check API key', 'danger');
        }
    },

    clearNetcore() {
        NetcoreService.clearCredentials();
        document.getElementById('set-nc-api').value = '';
        document.getElementById('set-nc-email').value = '';
        document.getElementById('set-nc-panel').value = '';
        window.App.showToast('Netcore credentials cleared', 'info');
    },

    saveAI() {
        const orKey = document.getElementById('set-or-key').value.trim();
        const orModel = document.getElementById('set-or-model').value.trim();
        const orMM = document.getElementById('set-or-mm').value.trim();

        if (orKey) localStorage.setItem('openrouter_api_key', orKey);
        if (orModel) localStorage.setItem('openrouter_model', orModel);
        if (orMM) localStorage.setItem('openrouter_multimodal_model', orMM);

        // Reinitialize GeminiService
        if (GeminiService.init) GeminiService.init();

        window.App.showToast('AI settings saved!', 'success');
    },

    async testAI() {
        if (!GeminiService.isLiveMode()) {
            window.App.showToast('Save an OpenRouter API key first', 'warning');
            return;
        }

        window.App.showToast('Testing AI connection...', 'info');
        const result = await GeminiService.generateContent('Say hello!', 'You are a testing assistant.');

        if (result.success) {
            window.App.showToast('✅ AI Connection Success! (Model: ' + result.model + ')', 'success');
        } else {
            window.App.showToast('❌ AI Connection Failed: ' + result.error, 'danger');
        }
    },

    saveSlack() {
        const webhook = document.getElementById('set-slack').value.trim();
        if (webhook) {
            localStorage.setItem('slack_webhook', webhook);
            if (SlackService.setWebhookUrl) SlackService.setWebhookUrl(webhook);
            window.App.showToast('Slack webhook saved!', 'success');
        }
    },

    saveProxy() {
        const proxy = document.getElementById('set-proxy').value.trim();
        if (proxy) {
            localStorage.setItem('proxy_url', proxy);
            window.APP_CONFIG.PROXY_URL = proxy;
            window.App.showToast('Proxy URL saved!', 'success');
        }
    },

    resetAI() {
        localStorage.removeItem('openrouter_api_key');
        localStorage.removeItem('openrouter_model');
        localStorage.removeItem('openrouter_multimodal_model');
        if (GeminiService.init) GeminiService.init();
        window.App.renderModule('settings'); // Re-render to show defaults
        window.App.showToast('AI Settings reset to hardcoded defaults', 'info');
    }
};

window.Settings = Settings;
export default Settings;
