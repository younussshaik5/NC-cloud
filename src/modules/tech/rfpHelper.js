// ========================================
// Tech Utilities — RFP Helper (Netcore Cloud)
// ========================================

import GeminiService from '../../services/geminiService.js';

const RfpHelper = {
    rfpData: null,

    render() {
        return `
        <div class="module-grid">
            <div class="glass-card module-panel">
                <h2>📄 RFP / Questionnaire</h2>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <div style="display:flex; align-items:center; gap:var(--space-2); flex-wrap:wrap;">
                        <input type="file" id="rfp-file" class="form-input" accept=".xlsx,.xls,.csv" disabled style="flex:1; opacity:0.6; cursor:not-allowed;" />
                        <span style="color:#f87171; font-size:var(--font-xs); font-weight:600;">⚠️ shaik has disabled the file input , as model run on credits</span>
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <label class="form-label">Or Paste Questions</label>
                    <textarea id="rfp-text" class="form-textarea" rows="8" placeholder="Paste RFP questions here, one per line...

Example:
1. Does your platform support omnichannel engagement?
2. What AI/ML capabilities do you offer?
3. Describe your email deliverability infrastructure
4. What personalization features are available?
5. Do you support AMP emails?"></textarea>
                </div>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <div style="display:flex; align-items:center; gap:var(--space-2); flex-wrap:wrap;">
                        <input type="file" id="rfp-docs" class="form-input" multiple disabled style="flex:1; opacity:0.6; cursor:not-allowed;" />
                        <span style="color:#f87171; font-size:var(--font-xs); font-weight:600;">⚠️ shaik has disabled the file input , as model run on credits</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-lg" onclick="RfpHelper.answerRFP()" style="width:100%">
                    📄 Answer RFP
                </button>
            </div>

            <div class="glass-card module-panel">
                <div class="result-header">
                    <h2>📝 RFP Responses</h2>
                    <div class="result-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.App.copyToClipboard('rfp-result')">📋 Copy</button>
                        <button class="btn btn-sm btn-secondary" onclick="RfpHelper.exportExcel()">📥 Export Excel</button>
                    </div>
                </div>
                <div id="rfp-result" class="result-content" style="max-height:500px;">
                    <div class="empty-state">
                        <div class="empty-state-icon">📄</div>
                        <h3>Upload or paste RFP questions</h3>
                        <p>AI will answer each question with Netcore Cloud product knowledge and best practices.</p>
                    </div>
                </div>
            </div>
        </div>`;
    },

    init() { },

    async handleUpload() {
        const file = document.getElementById('rfp-file').files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const wb = XLSX.read(e.target.result, { type: 'binary' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                this.rfpData = data;
                const questions = data.slice(1).map(row => row[0] || row[1] || '').filter(q => q.trim());
                document.getElementById('rfp-text').value = questions.join('\n');
                window.App.showToast(`Loaded ${questions.length} questions from Excel`, 'success');
            } catch (err) {
                window.App.showToast('Error reading file: ' + err.message, 'danger');
            }
        };
        reader.readAsBinaryString(file);
    },

    async answerRFP() {
        const text = document.getElementById('rfp-text').value;
        const resultEl = document.getElementById('rfp-result');

        if (!text.trim()) { window.App.showToast('Please upload or paste RFP questions', 'warning'); return; }

        resultEl.innerHTML = '<div class="loading-shimmer" style="height:300px"></div>';

        const docsInput = document.getElementById('rfp-docs');
        const attachments = [];
        if (docsInput.files.length > 0) {
            for (const file of docsInput.files) {
                attachments.push(await window.App.readFile(file));
            }
        }

        const prompt = `Answer these RFP questions as a Netcore Cloud Solution Presales Consultant. Provide comprehensive, accurate answers.

RFP Questions:
${text}

Use attached documents for additional context if provided.

**Format each answer as:**

### Q[N]: [Question]
**Answer:** [Comprehensive response referencing specific Netcore Cloud capabilities]
**Product Module:** [CE / Email API / Personalization / Product Experience / Inbox Commerce / Co-Marketer AI / CDP]

Be specific about Netcore Cloud's capabilities:
- CE Platform: omnichannel engagement, journey orchestration, segmentation, A/B testing
- Email API: RESTful API, SMTP relay, high deliverability, real-time tracking
- Personalization (Raman AI): 1:1 personalization, product recommendations, web/app personalization
- Product Experience: no-code nudges, walkthroughs, tooltips, surveys
- Inbox Commerce: AMP emails, in-email shopping, interactive emails
- Co-Marketer AI: Content Agent, Insights Agent, Segment Agent, Merchandiser Agent
- CDP: unified customer profiles, data unification, real-time segmentation
- Channels: Email, SMS, WhatsApp, App Push, Web Push, In-App, RCS, Web Messages
- SDKs: Android, iOS, React Native, Flutter, Web`;

        const result = await GeminiService.generateContent(prompt, 'You are a Netcore Cloud presales expert answering RFP questions. Be thorough, accurate, and highlight competitive advantages.', attachments);
        const badge = window.App.getAiBadge(result);

        if (result.success) {
            resultEl.innerHTML = `<div class="result-body">${window.MarkdownRenderer.parse(result.text)}</div><div class="result-meta">${badge}</div>`;
        } else {
            resultEl.innerHTML = `<div class="error-container" style="padding:var(--space-4); background:rgba(239,68,68,0.1); border-radius:var(--radius-md);"><div style="color:#f87171; font-weight:600;">❌ Failed</div><div style="color:var(--text-secondary);">${result.error}</div></div>`;
        }
    },

    exportExcel() {
        const el = document.getElementById('rfp-result');
        if (!el || !el.innerText.trim()) { window.App.showToast('No responses to export', 'warning'); return; }

        const rows = [['Question', 'Answer', 'Product Module']];
        const sections = el.innerText.split(/###\s*Q\d+:/);
        sections.forEach(s => {
            if (s.trim()) {
                const lines = s.trim().split('\n');
                const q = lines[0]?.trim() || '';
                const a = lines.slice(1).join(' ').replace(/Answer:|Product Module:/g, '|').split('|');
                rows.push([q, a[1]?.trim() || '', a[2]?.trim() || '']);
            }
        });

        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'RFP Responses');
        XLSX.writeFile(wb, 'netcore-rfp-responses.xlsx');
        window.App.showToast('Excel exported!', 'success');
    }
};

window.RfpHelper = RfpHelper;
export default RfpHelper;
