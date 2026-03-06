// ========================================
// Module 3: Value Architecture (ROI/TCO)
// Netcore Cloud Business Value
// ========================================

import GeminiService from '../services/geminiService.js';

const ValueArchitecture = {
    render() {
        return `
        <div class="module-page">
            <div class="module-header">
                <h1>💰 Value Architecture</h1>
                <p class="module-desc">AI-powered ROI/TCO modeling for Netcore Cloud — quantify business impact and justify investment.</p>
            </div>

            <div class="module-grid">
                <div class="glass-card module-panel">
                    <h2>📊 Business Inputs</h2>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Company Name</label>
                        <input id="roi-company" class="form-input" placeholder="e.g., Nykaa, Swiggy, Dream11" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Industry</label>
                        <input id="roi-industry" class="form-input" placeholder="e.g., E-commerce, BFSI, Gaming" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Current MarTech Spend (Annual)</label>
                        <input id="roi-spend" class="form-input" placeholder="e.g., $200,000" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Netcore Cloud Proposed ARR</label>
                        <input id="roi-arr" class="form-input" placeholder="e.g., $150,000" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Business Context & Metrics</label>
                        <textarea id="roi-context" class="form-textarea" rows="10" placeholder="Include relevant metrics:
• Monthly active users (MAU)
• Email volume per month
• Current email open/click rates
• Cart abandonment rate
• Customer acquisition cost (CAC)
• Current conversion rate
• Number of channels used
• Team size (marketing ops)
• Number of tools being consolidated
• Current personalization maturity"></textarea>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Attachments</label>
                        <input type="file" id="roi-file" class="form-input" multiple />
                    </div>
                    <button class="btn btn-primary btn-lg" onclick="ValueArchitecture.generateROI()" style="width:100%">
                        💰 Generate ROI Analysis
                    </button>
                </div>

                <div class="glass-card module-panel">
                    <div class="result-header">
                        <h2>📈 ROI / TCO Analysis</h2>
                        <div class="result-actions">
                            <button class="btn btn-sm btn-secondary" onclick="ValueArchitecture.copyResult()">📋 Copy</button>
                            <button class="btn btn-sm btn-secondary" onclick="ValueArchitecture.exportResult()">📥 Export</button>
                        </div>
                    </div>
                    <div id="roi-result" class="result-content" style="max-height:600px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">💰</div>
                            <h3>Enter business metrics above</h3>
                            <p>AI will build a comprehensive ROI model showing Netcore Cloud's business impact.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    init() { },

    async generateROI() {
        const company = document.getElementById('roi-company').value;
        const industry = document.getElementById('roi-industry').value;
        const spend = document.getElementById('roi-spend').value;
        const arr = document.getElementById('roi-arr').value;
        const context = document.getElementById('roi-context').value;
        const resultEl = document.getElementById('roi-result');

        if (!context.trim()) {
            window.App.showToast('Please enter business context', 'warning');
            return;
        }

        resultEl.innerHTML = '<div class="loading-shimmer" style="height:400px"></div>';

        const fileInput = document.getElementById('roi-file');
        const attachments = [];
        if (fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                attachments.push(await window.App.readFile(file));
            }
        }

        const prompt = `Generate a comprehensive ROI/TCO analysis for Netcore Cloud:

Company: ${company} | Industry: ${industry}
Current MarTech Spend: ${spend}
Proposed Netcore ARR: ${arr}

Business Context:
${context}

**Required output structure:**

## Executive Summary
2-3 sentence value proposition with headline ROI number.

## Total Cost of Ownership (TCO) Comparison
| Cost Category | Current Stack | Netcore Cloud | Savings |
| --- | --- | --- | --- |
| Platform licensing | ... | ... | ... |
| Email delivery (CPM) | ... | ... | ... |
| SMS / WhatsApp costs | ... | ... | ... |
| Personalization tools | ... | ... | ... |
| Analytics / CDP | ... | ... | ... |
| Integration & maintenance | ... | ... | ... |
| Team / operational overhead | ... | ... | ... |
| **Total** | **...** | **...** | **...** |

## Revenue Impact Analysis
| Lever | Current | With Netcore | Uplift |
| --- | --- | --- | --- |
| Email open rates | ... | ... (AI send-time optimization) | +X% |
| Click-through rates | ... | ... (Personalization) | +X% |
| Conversion rate | ... | ... (Journey orchestration) | +X% |
| Cart recovery | ... | ... (Omnichannel abandon flows) | +X% |
| Customer LTV | ... | ... (Re-engagement + Personalization) | +X% |
| Channel consolidation | ... | ... (Single platform) | ... |

## Platform Consolidation Value
List of tools Netcore Cloud replaces and their individual costs.

## AI-Driven Value (Co-Marketer / Raman AI)
Specific value from:
- Predictive segmentation → More targeted campaigns
- AI content generation → Faster campaign launches
- Product recommendations → Higher AOV
- Send-time optimization → Better engagement

## 3-Year ROI Projection
| Year | Investment | Revenue Uplift | Cost Savings | Net ROI |
| --- | --- | --- | --- | --- |
| Year 1 | ... | ... | ... | ... |
| Year 2 | ... | ... | ... | ... |
| Year 3 | ... | ... | ... | ... |
| **Total** | **...** | **...** | **...** | **X%** |

## Key Value Metrics
| Metric | Value |
| --- | --- |
| Payback Period | ... months |
| 3-Year ROI | X% |
| Annual Cost Savings | $X |
| Revenue Uplift | $X |`;

        const result = await GeminiService.generateContent(prompt, 'You are a Netcore Cloud value engineering specialist. Create credible ROI projections based on industry benchmarks. Netcore typically delivers: 20-40% email engagement uplift, 15-25% conversion improvement through personalization, 30-50% cost savings through platform consolidation, and 2-3x faster campaign launches with AI.', attachments);
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

    copyResult() {
        window.App.copyToClipboard('roi-result');
    },

    exportResult() {
        const el = document.getElementById('roi-result');
        if (!el || !el.innerText.trim()) {
            window.App.showToast('No analysis to export', 'warning');
            return;
        }
        const blob = new Blob([el.innerHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'netcore-roi-analysis.html';
        a.click();
        URL.revokeObjectURL(url);
        window.App.showToast('Analysis exported!', 'success');
    }
};

window.ValueArchitecture = ValueArchitecture;
export default ValueArchitecture;
