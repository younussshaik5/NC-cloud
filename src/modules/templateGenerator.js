// ========================================
// Template Generator (Netcore Cloud)
// AI-generated email templates & landing pages
// ========================================

import GeminiService from '../services/geminiService.js';

const TemplateGenerator = {
    messages: [],
    generatedHTML: '',
    attachments: [],

    render() {
        return `
        <div class="module-page">
            <div class="module-header">
                <h1>🌐 Template Generator</h1>
                <p class="module-desc">AI-powered email templates, landing pages, and in-app message designs for Netcore Cloud demos.</p>
            </div>

            <div class="module-grid">
                <div class="glass-card module-panel">
                    <h2>💬 Design Assistant</h2>
                    <div id="tg-chat" class="chat-container" style="height:400px; overflow-y:auto; margin-bottom:var(--space-4); padding:var(--space-3); background:rgba(0,0,0,0.2); border-radius:var(--radius-md);"></div>
                    
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Template Type</label>
                        <select id="tg-type" class="form-input">
                            <option>Email Template</option>
                            <option>AMP Email</option>
                            <option>Landing Page</option>
                            <option>In-App Message</option>
                            <option>Web Push Notification</option>
                        </select>
                    </div>

                    <div style="display:flex; gap:var(--space-2)">
                        <input id="tg-input" class="form-input" placeholder="Describe the design you want..." style="flex:1" onkeydown="if(event.key==='Enter') TemplateGenerator.send()" />
                        <button class="btn btn-primary" onclick="TemplateGenerator.send()">Generate</button>
                    </div>

                    <div class="form-group" style="margin-top:var(--space-3)">
                        <div style="display:flex; align-items:center; gap:var(--space-2); flex-wrap:wrap;">
                            <input type="file" id="tg-file" class="form-input" multiple disabled style="flex:1; opacity:0.6; cursor:not-allowed;" />
                            <span style="color:#f87171; font-size:var(--font-xs); font-weight:600;">⚠️ shaik has disabled the file input , as model run on credits</span>
                        </div>
                    </div>
                </div>

                <div class="glass-card module-panel">
                    <div class="result-header">
                        <h2>🎨 Preview</h2>
                        <div class="result-actions">
                            <button class="btn btn-sm btn-secondary" onclick="TemplateGenerator.copyCode()">📋 Copy HTML</button>
                            <button class="btn btn-sm btn-secondary" onclick="TemplateGenerator.download()">📥 Download</button>
                        </div>
                    </div>
                    <div id="tg-preview" class="result-content" style="min-height:500px; padding:0; overflow:hidden;">
                        <div class="empty-state">
                            <div class="empty-state-icon">🎨</div>
                            <h3>No template generated</h3>
                            <p>Describe your design requirements on the left to see the live preview here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    init() {
        this.messages = [];
        this.generatedHTML = '';
        this.addMessage('assistant', 'Hi! I\'m the Netcore Cloud Template Generator. Tell me what kind of template you need — email, landing page, AMP email, or in-app message. Describe the brand, purpose, and any specific elements you want.');
    },

    addMessage(role, text) {
        this.messages.push({ role, text });
        this.renderMessages();
    },

    renderMessages() {
        const chatEl = document.getElementById('tg-chat');
        if (!chatEl) return;
        chatEl.innerHTML = this.messages.map(m => `
            <div style="margin-bottom:var(--space-3); text-align:${m.role === 'user' ? 'right' : 'left'}">
                <div style="display:inline-block; max-width:85%; padding:var(--space-2) var(--space-3); border-radius:var(--radius-md); background:${m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}; color:${m.role === 'user' ? 'white' : 'var(--text-primary)'}; font-size:var(--font-sm);">
                    ${m.text}
                </div>
            </div>
        `).join('');
        chatEl.scrollTop = chatEl.scrollHeight;
    },

    async send() {
        const input = document.getElementById('tg-input');
        const type = document.getElementById('tg-type').value;
        const text = input.value.trim();
        if (!text) return;

        this.addMessage('user', text);
        input.value = '';

        const previewEl = document.getElementById('tg-preview');
        previewEl.innerHTML = '<div class="loading-shimmer" style="height:400px; margin:var(--space-4);"></div>';

        const prompt = `Generate a complete, production-ready ${type} based on this request:

"${text}"

Chat history for context:
${this.messages.slice(0, -1).map(m => `${m.role}: ${m.text}`).join('\n')}

Requirements:
- Generate COMPLETE, valid HTML with inline CSS
- Use modern, visually appealing design
- Include responsive styling
- Use placeholder images from https://placehold.co/ if needed
- For emails: use table-based layout for compatibility
- For AMP emails: include AMP components if applicable
- Include Netcore Cloud personalization tokens where appropriate (e.g., {{first_name}}, {{product_name}})
- Make it look professional and ready for demo

Return ONLY the HTML code, no explanations.`;

        const result = await GeminiService.generateContent(prompt, 'You are an expert email and web template designer for Netcore Cloud. Generate beautiful, production-ready HTML templates.', this.attachments);

        if (result.success) {
            let html = result.text.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
            this.generatedHTML = html;
            this.addMessage('assistant', '✅ Template generated! Check the preview on the right. You can ask me to modify any part of it.');
            this.renderPreview(html);
        } else {
            this.addMessage('assistant', `❌ Failed to generate: ${result.error}`);
            previewEl.innerHTML = `<div class="empty-state" style="padding:var(--space-8)"><div class="empty-state-icon">❌</div><h3>Generation failed</h3><p>${result.error}</p></div>`;
        }
    },

    renderPreview(html) {
        const previewEl = document.getElementById('tg-preview');
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'width:100%; height:500px; border:none; border-radius:var(--radius-md);';
        previewEl.innerHTML = '';
        previewEl.appendChild(iframe);
        iframe.contentDocument.open();
        iframe.contentDocument.write(html);
        iframe.contentDocument.close();
    },

    copyCode() {
        if (!this.generatedHTML) { window.App.showToast('No template to copy', 'warning'); return; }
        navigator.clipboard.writeText(this.generatedHTML);
        window.App.showToast('HTML code copied!', 'success');
    },

    download() {
        if (!this.generatedHTML) { window.App.showToast('No template to download', 'warning'); return; }
        const blob = new Blob([this.generatedHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'netcore-template.html';
        a.click();
        URL.revokeObjectURL(url);
        window.App.showToast('Downloaded!', 'success');
    },

    async handleFileSelect() {
        const fileInput = document.getElementById('tg-file');
        this.attachments = [];
        if (fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                this.attachments.push(await window.App.readFile(file));
            }
            window.App.showToast(`${fileInput.files.length} file(s) attached`, 'info');
        }
    }
};

window.TemplateGenerator = TemplateGenerator;
export default TemplateGenerator;
