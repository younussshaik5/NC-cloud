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

            <div class="glass-card" style="margin-top:var(--space-8); padding:var(--space-12); text-align:center; display:flex; flex-direction:column; align-items:center; gap:var(--space-6); background:rgba(0,0,0,0.3); border:1px dashed var(--border-default);">
                <div style="font-size:4rem; filter:drop-shadow(0 0 20px var(--accent-primary-glow));">🌐</div>
                <div style="max-width:500px;">
                    <h2 style="font-size:var(--font-2xl); margin-bottom:var(--space-2); background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">its under building</h2>
                    <p style="color:var(--text-tertiary); font-size:var(--font-lg); line-height:1.6;">
                        Our design agent is learning Netcore Cloud's premium template standards. 
                        Soon you'll be able to generate stunning, high-conversion templates with one click.
                    </p>
                </div>
                <div class="loader-dots"><span></span><span></span><span></span></div>
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
