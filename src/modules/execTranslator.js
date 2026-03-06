// ========================================
// Module 6: Exec Translator
// Netcore Cloud CXO Messaging
// ========================================

import GeminiService from '../services/geminiService.js';

const ExecTranslator = {
    render() {
        return `
        <div class="module-page">
            <div class="module-header">
                <h1>🎤 Exec Translator</h1>
                <p class="module-desc">Convert Netcore Cloud technical capabilities into strategic benefits for CXO personas.</p>
            </div>

            <div class="glass-card module-panel" style="max-width:600px;margin-bottom:var(--space-6)">
                <h2>⚡ Input</h2>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <label class="form-label">Technical Feature / Capability</label>
                    <input id="exec-feature" class="form-input" placeholder="e.g., Raman AI Personalization, Co-Marketer Agentic AI, Inbox Commerce AMP, Journey Orchestration" />
                </div>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <label class="form-label">Target Persona</label>
                    <div class="chip-group" id="exec-personas">
                        <button class="chip selected" data-persona="CMO" onclick="ExecTranslator.selectPersona(this)">📢 CMO</button>
                        <button class="chip" data-persona="CTO" onclick="ExecTranslator.selectPersona(this)">🖥️ CTO</button>
                        <button class="chip" data-persona="CFO" onclick="ExecTranslator.selectPersona(this)">💰 CFO</button>
                        <button class="chip" data-persona="CEO" onclick="ExecTranslator.selectPersona(this)">👔 CEO</button>
                        <button class="chip" data-persona="VP Growth" onclick="ExecTranslator.selectPersona(this)">📈 VP Growth</button>
                        <button class="chip" data-persona="ALL" onclick="ExecTranslator.selectPersona(this)">🎯 All Personas</button>
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <label class="form-label">Industry Context (optional)</label>
                    <input id="exec-industry" class="form-input" placeholder="e.g., E-commerce, BFSI, Gaming, EdTech" />
                </div>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <div style="display:flex; align-items:center; gap:var(--space-2); flex-wrap:wrap;">
                        <input type="file" id="exec-file" class="form-input" multiple disabled style="flex:1; opacity:0.6; cursor:not-allowed;" />
                        <span style="color:#f87171; font-size:var(--font-xs); font-weight:600;">⚠️ shaik has disabled the file input , as model run on credits</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-lg" onclick="ExecTranslator.translate()" style="width:100%">
                    🎤 Translate for Executive
                </button>
            </div>

            <div id="exec-results" class="module-grid">
                <!-- Results rendered here -->
            </div>
        </div>`;
    },

    selectedPersona: 'CMO',

    init() { },

    selectPersona(el) {
        document.querySelectorAll('#exec-personas .chip').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        this.selectedPersona = el.dataset.persona;
    },

    async translate() {
        const feature = document.getElementById('exec-feature').value;
        const industry = document.getElementById('exec-industry').value;
        const resultsEl = document.getElementById('exec-results');

        if (!feature.trim()) {
            window.App.showToast('Enter a technical feature', 'warning');
            return;
        }

        const fileInput = document.getElementById('exec-file');
        const attachments = [];
        if (fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                attachments.push(await window.App.readFile(file));
            }
        }

        const personas = this.selectedPersona === 'ALL' ? ['CMO', 'CTO', 'CFO', 'CEO', 'VP Growth'] : [this.selectedPersona];

        resultsEl.innerHTML = personas.map(p => `
            <div class="glass-card module-panel">
                <h2>${p === 'CMO' ? '📢' : p === 'CTO' ? '🖥️' : p === 'CFO' ? '💰' : p === 'CEO' ? '👔' : '📈'} ${p} Translation</h2>
                <div class="loading-shimmer" style="height:200px"></div>
            </div>
        `).join('');

        for (let i = 0; i < personas.length; i++) {
            const persona = personas[i];
            const prompt = `You are the Exec Translator for Netcore Cloud. Convert this technical capability into strategic benefits for a ${persona}:

Technical Feature: "${feature}"
${industry ? `Industry: ${industry}` : ''}

Use any attached technical specs to accurately represent the capabilities.

**Required output structure:**

## Strategic Benefits for ${persona}
2-3 strategic benefit framings with emoji bullets, each with a **bold title** and detailed explanation relevant to ${persona}'s focus areas.

## Impact Summary
| Technical Capability | Strategic Benefit | ${persona} KPI Impact |
| --- | --- | --- |
(Map each aspect to a measurable KPI)

## Recommended Talking Points
3 bullet points tailored for ${persona}'s vocabulary and priorities.

Frame for ${persona}'s priorities:
- CMO: Customer engagement, brand loyalty, conversion rates, campaign ROI, personalization at scale
- CTO: Data architecture, integration simplicity, scalability, security, API-first design, SDK quality
- CFO: Cost consolidation, ROI, predictable spend, vendor reduction, operational efficiency
- CEO: Market differentiation, revenue growth, customer retention, competitive advantage
- VP Growth: User acquisition, retention loops, A/B testing velocity, funnel optimization, growth metrics`;

            const result = await GeminiService.generateContent(prompt, 'You are an expert at translating Netcore Cloud technical capabilities into executive-level strategic value for martech buying decisions.', attachments);
            const badge = window.App.getAiBadge(result);
            const cards = resultsEl.querySelectorAll('.glass-card');
            const card = cards[i];

            if (card) {
                if (result.success) {
                    card.innerHTML = `
                        <div class="result-header">
                            <h2>${persona === 'CMO' ? '📢' : persona === 'CTO' ? '🖥️' : persona === 'CFO' ? '💰' : persona === 'CEO' ? '👔' : '📈'} ${persona} Translation</h2>
                            <button class="btn btn-sm btn-secondary" onclick="window.App.copyToClipboard(this.closest('.glass-card').querySelector('.result-content'))">📋 Copy</button>
                        </div>
                        <div class="result-content">${window.MarkdownRenderer ? window.MarkdownRenderer.parse(result.text) : result.text}</div>
                        <div class="result-meta" style="margin-top:var(--space-4); opacity:0.8;">${badge}</div>
                    `;
                } else {
                    card.innerHTML = `
                        <div class="result-header">
                             <h2>${persona === 'CMO' ? '📢' : persona === 'CTO' ? '🖥️' : persona === 'CFO' ? '💰' : persona === 'CEO' ? '👔' : '📈'} ${persona} Translation</h2>
                        </div>
                        <div class="error-container" style="padding:var(--space-4); background:rgba(239,68,68,0.1); border-radius:var(--radius-md); border:1px solid rgba(239,68,68,0.2);">
                            <div style="color:#f87171; font-weight:600;">❌ AI Translation Failed</div>
                            <div style="color:var(--text-secondary); font-size:var(--font-sm);">${result.error}</div>
                        </div>
                    `;
                }
            }
        }
    }
};

window.ExecTranslator = ExecTranslator;
export default ExecTranslator;
