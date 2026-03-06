// ========================================
// Grounding Engine — Netcore Cloud
// Knowledge-grounded AI search
// ========================================

import GeminiService from '../services/geminiService.js';

const GroundingEngine = {
    render() {
        return `
        <div class="module-page">
            <div class="module-header">
                <h1>🧠 Grounding Engine</h1>
                <p class="module-desc">AI with web grounding — research Netcore Cloud topics, competitor analysis, and market intelligence.</p>
            </div>

            <div class="glass-card module-panel" style="max-width:800px;">
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <label class="form-label">Research Query</label>
                    <textarea id="ge-query" class="form-textarea" rows="4" placeholder="Ask anything — the AI will search the web for grounded answers...

Examples:
• 'Latest Netcore Cloud product announcements 2025'
• 'Compare Netcore CE vs MoEngage for e-commerce'
• 'Martech industry trends APAC 2025'
• 'Netcore Cloud customer case studies BFSI'"></textarea>
                </div>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <label class="form-label">Research Focus</label>
                    <select id="ge-mode" class="form-input">
                        <option value="general">🌐 General Research</option>
                        <option value="competitive">⚔️ Competitive Intelligence</option>
                        <option value="product">📱 Netcore Product Deep-Dive</option>
                        <option value="industry">📊 Industry / Market Research</option>
                        <option value="technical">🔧 Technical Documentation</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <div style="display:flex; align-items:center; gap:var(--space-2); flex-wrap:wrap;">
                        <input type="file" id="ge-file" class="form-input" multiple disabled style="flex:1; opacity:0.6; cursor:not-allowed;" />
                        <span style="color:#f87171; font-size:var(--font-xs); font-weight:600;">⚠️ shaik has disabled the file input , as model run on credits</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-lg" onclick="GroundingEngine.search()" style="width:100%">
                    🧠 Research
                </button>
            </div>

            <div class="glass-card module-panel" style="max-width:800px; margin-top:var(--space-6)">
                <div class="result-header">
                    <h2>📋 Results</h2>
                    <div class="result-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.App.copyToClipboard('ge-result')">📋 Copy</button>
                    </div>
                </div>
                <div id="ge-result" class="result-content" style="max-height:600px;">
                    <div class="empty-state">
                        <div class="empty-state-icon">🧠</div>
                        <h3>Enter a research query</h3>
                        <p>Uses Google Gemini with web grounding for real-time, sourced answers.</p>
                    </div>
                </div>
            </div>
        </div>`;
    },

    init() { },

    async search() {
        const query = document.getElementById('ge-query').value;
        const mode = document.getElementById('ge-mode').value;
        const resultEl = document.getElementById('ge-result');

        if (!query.trim()) { window.App.showToast('Enter a research query', 'warning'); return; }

        resultEl.innerHTML = '<div class="loading-shimmer" style="height:300px"></div>';

        const fileInput = document.getElementById('ge-file');
        const attachments = [];
        if (fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                attachments.push(await window.App.readFile(file));
            }
        }

        const modeContextMap = {
            general: 'Provide comprehensive, well-sourced research.',
            competitive: 'Focus on competitive positioning of Netcore Cloud vs competitors (MoEngage, CleverTap, Braze, Iterable, WebEngage, Insider). Include recent developments, pricing, feature comparisons.',
            product: 'Focus on Netcore Cloud product capabilities, features, and recent updates. Products: CE Platform, Email API, Personalization (Raman AI), Product Experience, Inbox Commerce, Co-Marketer AI.',
            industry: 'Focus on martech industry trends, market size, growth projections, and how Netcore Cloud is positioned.',
            technical: 'Focus on Netcore Cloud technical documentation, SDK references, API specifications, and integration guides.'
        };

        const systemInstruction = `You are a Netcore Cloud research analyst. ${modeContextMap[mode]}

Format your response with:
- Clear headers and sections
- Tables where appropriate
- Bullet points for key findings
- Source citations where possible
- Actionable takeaways for a Solution Presales Consultant`;

        // All research now flows through OpenRouter
        const result = await GeminiService.generateContent(
            `Research the following topic and provide a comprehensive, well-structured answer:\n\n${query}`,
            systemInstruction,
            attachments
        );

        const badge = window.App.getAiBadge(result);

        if (result.success) {
            resultEl.innerHTML = `
                <div class="result-body">${window.MarkdownRenderer.parse(result.text)}</div>
                <div class="result-meta">${badge}</div>
            `;
        } else {
            resultEl.innerHTML = `
                <div class="error-container" style="padding:var(--space-4); background:rgba(239,68,68,0.1); border-radius:var(--radius-md); border:1px solid rgba(239,68,68,0.2);">
                    <div style="color:#f87171; font-weight:600;">❌ Research Failed</div>
                    <div style="color:var(--text-secondary);">${result.error}</div>
                </div>
            `;
        }
    }
};

window.GroundingEngine = GroundingEngine;
export default GroundingEngine;
