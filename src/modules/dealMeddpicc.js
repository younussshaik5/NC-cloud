// ========================================
// Module 5: Deal MEDDPICC Analyzer
// Netcore Cloud Deal Qualification
// ========================================

import GeminiService from '../services/geminiService.js';

const DealMeddpicc = {
    render() {
        return `
        <div class="module-page">
            <div class="module-header">
                <h1>📊 Deal MEDDPICC</h1>
                <p class="module-desc">Enterprise-grade qualification framework for Netcore Cloud deals — assess health and next best actions.</p>
            </div>

            <div class="module-grid">
                <div class="glass-card module-panel">
                    <h2>📋 Deal Information</h2>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Deal Name</label>
                        <input id="meddpicc-deal" class="form-input" placeholder="e.g., PolicyBazaar — CE Platform + Email API + Personalization" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Deal Value (ARR)</label>
                        <input id="meddpicc-value" class="form-input" placeholder="e.g., $150,000" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Discovery Notes / Deal Context</label>
                        <textarea id="meddpicc-notes" class="form-textarea" rows="10" placeholder="Paste all discovery notes, meeting summaries, and deal context here...

Include details about:
• Key stakeholders (CMO, VP Marketing, Head of Growth, CTO)
• Customer pain points and engagement metrics
• Decision criteria and evaluation process
• Competition in the deal (MoEngage, CleverTap, etc.)
• Champion details and their influence
• Timeline, budget, and procurement process
• Current martech stack and migration concerns"></textarea>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                         <label class="form-label">Attachments (Account Plan, Org Chart)</label>
                         <input type="file" id="meddpicc-file" class="form-input" multiple />
                    </div>
                    <button class="btn btn-primary btn-lg" onclick="DealMeddpicc.analyze()" style="width:100%">
                        📊 Analyze Deal
                    </button>
                </div>

                <div class="glass-card module-panel">
                    <div class="result-header">
                        <h2>🎯 MEDDPICC Analysis</h2>
                        <div class="result-actions">
                            <button class="btn btn-sm btn-secondary" onclick="DealMeddpicc.copy()">📋 Copy</button>
                            <button class="btn btn-sm btn-secondary" onclick="DealMeddpicc.slack()">💬 Slack</button>
                        </div>
                    </div>
                    <div id="meddpicc-result" class="result-content" style="max-height:600px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">📊</div>
                            <h3>Enter deal information</h3>
                            <p>AI will evaluate across all MEDDPICC dimensions with scores, gap analysis, and recommended actions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    init() { },

    async analyze() {
        const deal = document.getElementById('meddpicc-deal').value;
        const value = document.getElementById('meddpicc-value').value;
        const notes = document.getElementById('meddpicc-notes').value;
        const resultEl = document.getElementById('meddpicc-result');

        if (!notes.trim()) {
            window.App.showToast('Please enter discovery notes', 'warning');
            return;
        }

        resultEl.innerHTML = '<div class="loading-shimmer" style="height:400px"></div>';

        const fileInput = document.getElementById('meddpicc-file');
        const attachments = [];
        if (fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                attachments.push(await window.App.readFile(file));
            }
        }

        const prompt = `Perform a MEDDPICC analysis for this Netcore Cloud deal:

Deal: ${deal} | Value: ${value}

Discovery Notes:
${notes}

Analyze any attached account plans or org charts.

**Required output structure:**

## MEDDPICC Scorecard
| Dimension | Score /10 | Indicator | Key Finding |
| --- | --- | --- | --- |
| **M**etrics | X/10 | 🟢/🟡/🔴 | ... |
| **E**conomic Buyer | X/10 | 🟢/🟡/🔴 | ... |
| **D**ecision Criteria | X/10 | 🟢/🟡/🔴 | ... |
| **D**ecision Process | X/10 | 🟢/🟡/🔴 | ... |
| **P**aper Process | X/10 | 🟢/🟡/🔴 | ... |
| **I**dentify Pain | X/10 | 🟢/🟡/🔴 | ... |
| **C**hampion | X/10 | 🟢/🟡/🔴 | ... |
| **C**ompetition | X/10 | 🟢/🟡/🔴 | ... |
(Use 🟢 7-10, 🟡 4-6, 🔴 1-3)

## Detailed Assessment
For each dimension scoring below 7, provide:
- **Assessment:** What we know
- **Gap:** What's missing
- **Action:** Specific next step to improve the score

## Deal Health Summary
- **Overall Score:** X/80
- **Risk Level:** [🔴 HIGH / 🟡 MEDIUM / 🟢 LOW]

## Top 3 Priority Actions
| Priority | Action | Urgency | Owner |
| --- | --- | --- | --- |
| 1 | ... | 🔴/🟡 | SC/AE |
| 2 | ... | ... | ... |
| 3 | ... | ... | ... |`;

        const result = await GeminiService.generateContent(prompt, 'You are a MEDDPICC methodology expert evaluating enterprise martech deals for Netcore Cloud. Consider typical martech buying cycles, marketing team structures, and competitive dynamics with MoEngage, CleverTap, Braze, etc.', attachments);
        const badge = window.App.getAiBadge(result);

        if (result.success) {
            resultEl.innerHTML = `
                <div class="result-body">${window.MarkdownRenderer.parse(result.text)}</div>
                <div class="result-meta">${badge}</div>
            `;
        } else {
            resultEl.innerHTML = `
                <div class="error-container" style="padding:var(--space-4); background:rgba(239,68,68,0.1); border-radius:var(--radius-md); border:1px solid rgba(239,68,68,0.2);">
                    <div style="color:#f87171; font-weight:600;">❌ AI Generation Failed</div>
                    <div style="color:var(--text-secondary); font-size:var(--font-sm);">${result.error}</div>
                </div>
            `;
        }
    },

    copy() {
        window.App.copyToClipboard('meddpicc-result');
    },

    slack() {
        const el = document.getElementById('meddpicc-result');
        import('../services/slackService.js').then(mod => {
            mod.default.sendMessage(`📊 *Netcore Cloud MEDDPICC Analysis*\n\n${el.innerText}`);
            window.App.showToast('Sent to Slack!', 'success');
        });
    }
};

window.DealMeddpicc = DealMeddpicc;
export default DealMeddpicc;
