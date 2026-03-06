// ========================================
// Module 2: Identified Risk Report
// Netcore Cloud Deal Risk Analysis
// ========================================

import GeminiService from '../services/geminiService.js';

const RiskReport = {
    render() {
        return `
        <div class="module-page">
            <div class="module-header">
                <h1>⚠️ Risk Report</h1>
                <p class="module-desc">AI-powered deal risk identification and mitigation planning for Netcore Cloud opportunities.</p>
            </div>

            <div class="module-grid">
                <div class="glass-card module-panel">
                    <h2>📋 Deal Context</h2>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Deal Name</label>
                        <input id="risk-deal" class="form-input" placeholder="e.g., BigBasket — CE Platform + Email API" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Deal Value (ARR)</label>
                        <input id="risk-value" class="form-input" placeholder="e.g., $120,000" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Current Stage</label>
                        <select id="risk-stage" class="form-input">
                            <option>Discovery</option>
                            <option>Demo / POC</option>
                            <option>Evaluation</option>
                            <option>Proposal</option>
                            <option>Negotiation</option>
                            <option>Closing</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Deal Notes & Context</label>
                        <textarea id="risk-notes" class="form-textarea" rows="10" placeholder="Include details about:
• Customer's current martech stack (MoEngage, CleverTap, Braze, etc.)
• Key stakeholders and their positions
• Integration requirements (Shopify, Segment, GA, etc.)
• Data migration concerns
• Budget constraints
• Timeline pressures
• Technical blockers
• Competitive threats"></textarea>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <div style="display:flex; align-items:center; gap:var(--space-2); flex-wrap:wrap;">
                            <input type="file" id="risk-file" class="form-input" multiple disabled style="flex:1; opacity:0.6; cursor:not-allowed;" />
                            <span style="color:#f87171; font-size:var(--font-xs); font-weight:600;">⚠️ shaik has disabled the file input , as model run on credits</span>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-lg" onclick="RiskReport.generateReport()" style="width:100%">
                        ⚠️ Generate Risk Report
                    </button>
                </div>

                <div class="glass-card module-panel">
                    <div class="result-header">
                        <h2>📊 Risk Analysis</h2>
                        <div class="result-actions">
                            <button class="btn btn-sm btn-secondary" onclick="RiskReport.copyReport()">📋 Copy</button>
                            <button class="btn btn-sm btn-secondary" onclick="RiskReport.shareToSlack()">💬 Slack</button>
                            <button class="btn btn-sm btn-secondary" onclick="RiskReport.exportReport()">📥 Export</button>
                        </div>
                    </div>
                    <div id="risk-result" class="result-content" style="max-height:600px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">⚠️</div>
                            <h3>Enter deal context above</h3>
                            <p>AI will identify risks across technical, commercial, competitive, and organizational dimensions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    init() { },

    async generateReport() {
        const deal = document.getElementById('risk-deal').value;
        const value = document.getElementById('risk-value').value;
        const stage = document.getElementById('risk-stage').value;
        const notes = document.getElementById('risk-notes').value;
        const resultEl = document.getElementById('risk-result');

        if (!notes.trim()) {
            window.App.showToast('Please enter deal notes', 'warning');
            return;
        }

        resultEl.innerHTML = '<div class="loading-shimmer" style="height:400px"></div>';

        const fileInput = document.getElementById('risk-file');
        const attachments = [];
        if (fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                attachments.push(await window.App.readFile(file));
            }
        }

        const prompt = `Perform a comprehensive risk analysis for this Netcore Cloud deal:

Deal: ${deal} | Value: ${value} | Stage: ${stage}

Deal Notes:
${notes}

**Required output structure:**

## Risk Heatmap
| Risk Category | Severity | Probability | Impact | Status |
| --- | --- | --- | --- | --- |
| Technical Integration | 🔴/🟡/🟢 | High/Med/Low | ... | ... |
| Data Migration | 🔴/🟡/🟢 | ... | ... | ... |
| Competitive Threat | 🔴/🟡/🟢 | ... | ... | ... |
| Budget / Commercial | 🔴/🟡/🟢 | ... | ... | ... |
| Organizational / Champion | 🔴/🟡/🟢 | ... | ... | ... |
| Timeline | 🔴/🟡/🟢 | ... | ... | ... |
| Channel Readiness | 🔴/🟡/🟢 | ... | ... | ... |

## Detailed Risk Assessment
For each HIGH or MEDIUM risk:
### [Risk Name]
- **Description**: What the risk is
- **Evidence**: What from the notes suggests this risk
- **Impact**: What happens if this risk materializes
- **Mitigation Strategy**: Specific actions to reduce the risk
- **Owner**: SC (Solution Consultant) / AE / CSM / Engineering

## Competitive Risk Analysis
If competing platforms are involved:
| Competitor | Threat Level | Their Strength | Our Counter |
| --- | --- | --- | --- |
| ... | ... | ... | ... |

## Deal Health Score
- **Overall Risk Level**: 🔴 HIGH / 🟡 MEDIUM / 🟢 LOW
- **Win Probability**: X%
- **Key Blocker**: The single biggest risk to address

## Recommended Next Steps
| Priority | Action | Owner | Deadline |
| --- | --- | --- | --- |
| 1 | ... | SC/AE | ... |
| 2 | ... | ... | ... |`;

        const result = await GeminiService.generateContent(prompt, 'You are a Netcore Cloud presales risk analyst. Identify risks specific to martech implementations — data migration, channel readiness, integration complexity, competitive displacement, and organizational change management.', attachments);
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

    copyReport() {
        window.App.copyToClipboard('risk-result');
    },

    shareToSlack() {
        const el = document.getElementById('risk-result');
        import('../services/slackService.js').then(mod => {
            mod.default.sendMessage(`⚠️ *Netcore Cloud Risk Report*\n\n${el.innerText}`);
            window.App.showToast('Sent to Slack!', 'success');
        });
    },

    exportReport() {
        const el = document.getElementById('risk-result');
        if (!el || !el.innerText.trim()) {
            window.App.showToast('No report to export', 'warning');
            return;
        }
        const blob = new Blob([el.innerHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'netcore-risk-report.html';
        a.click();
        URL.revokeObjectURL(url);
        window.App.showToast('Report exported!', 'success');
    }
};

window.RiskReport = RiskReport;
export default RiskReport;
