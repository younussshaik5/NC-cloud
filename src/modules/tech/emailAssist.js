// ========================================
// Tech Utilities — Email Assist (Netcore Cloud)
// ========================================

import GeminiService from '../../services/geminiService.js';

const EmailAssist = {
    render() {
        return `
        <div class="module-grid">
            <div class="glass-card module-panel">
                <h2>✉️ Email Compose / Reply</h2>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <label class="form-label">Context / Thread</label>
                    <textarea id="ea-thread" class="form-textarea" rows="8" placeholder="Paste the email thread or describe the context...

Examples:
• Customer asking about Netcore CE pricing
• Follow-up after a demo of Personalization
• RFP response for Journey Builder capabilities
• Technical integration questions about SDK/API"></textarea>
                </div>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <label class="form-label">Tone</label>
                    <select id="ea-tone" class="form-input">
                        <option>Professional</option>
                        <option>Friendly</option>
                        <option>Executive / Formal</option>
                        <option>Technical</option>
                        <option>Consultative</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <label class="form-label">Attachments</label>
                    <input type="file" id="ea-file" class="form-input" multiple />
                </div>
                <button class="btn btn-primary btn-lg" onclick="EmailAssist.generate()" style="width:100%">
                    ✉️ Generate Email
                </button>
            </div>

            <div class="glass-card module-panel">
                <div class="result-header">
                    <h2>📝 Draft</h2>
                    <button class="btn btn-sm btn-secondary" onclick="window.App.copyToClipboard('ea-result')">📋 Copy</button>
                </div>
                <div id="ea-result" class="result-content" style="max-height:500px;">
                    <div class="empty-state">
                        <div class="empty-state-icon">✉️</div>
                        <h3>Provide context above</h3>
                        <p>AI will draft a professional email response with Netcore Cloud product knowledge.</p>
                    </div>
                </div>
            </div>
        </div>`;
    },

    init() { },

    async generate() {
        const thread = document.getElementById('ea-thread').value;
        const tone = document.getElementById('ea-tone').value;
        const resultEl = document.getElementById('ea-result');

        if (!thread.trim()) { window.App.showToast('Please enter email context', 'warning'); return; }

        resultEl.innerHTML = '<div class="loading-shimmer" style="height:200px"></div>';

        const fileInput = document.getElementById('ea-file');
        const attachments = [];
        if (fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                attachments.push(await window.App.readFile(file));
            }
        }

        const prompt = `Draft a ${tone} email reply for a Netcore Cloud Solution Presales Consultant.

Context/Thread:
${thread}

Requirements:
- Sound knowledgeable about Netcore Cloud products (CE Platform, Email API, Personalization, Product Experience, Inbox Commerce, Co-Marketer AI)
- Include relevant product capabilities where appropriate
- Maintain ${tone} tone throughout
- Include a clear call-to-action
- Format with proper email structure (greeting, body, closing)`;

        const result = await GeminiService.generateContent(prompt, 'You are a Netcore Cloud Solution Presales Consultant composing professional emails. Reference specific Netcore capabilities naturally.', attachments);
        const badge = window.App.getAiBadge(result);

        if (result.success) {
            resultEl.innerHTML = `<div class="result-body">${window.MarkdownRenderer.parse(result.text)}</div><div class="result-meta">${badge}</div>`;
        } else {
            resultEl.innerHTML = `<div class="error-container" style="padding:var(--space-4); background:rgba(239,68,68,0.1); border-radius:var(--radius-md);"><div style="color:#f87171; font-weight:600;">❌ Failed</div><div style="color:var(--text-secondary);">${result.error}</div></div>`;
        }
    }
};

window.EmailAssist = EmailAssist;
export default EmailAssist;
