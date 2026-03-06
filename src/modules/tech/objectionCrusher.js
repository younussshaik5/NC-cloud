// ========================================
// Tech Utilities — Objection Crusher (Netcore Cloud)
// ========================================

import GeminiService from '../../services/geminiService.js';

const ObjectionCrusher = {
    render() {
        return `
        <div class="module-grid">
            <div class="glass-card module-panel">
                <h2>💪 Objection Details</h2>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <label class="form-label">Objection / Concern</label>
                    <textarea id="oc-objection" class="form-textarea" rows="4" placeholder="e.g., 'MoEngage gives us better mobile analytics' or 'Braze has real-time processing that Netcore can't match'"></textarea>
                </div>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <label class="form-label">Competitor (if applicable)</label>
                    <select id="oc-competitor" class="form-input">
                        <option value="">None / General</option>
                        <option>MoEngage</option>
                        <option>CleverTap</option>
                        <option>Braze</option>
                        <option>Iterable</option>
                        <option>WebEngage</option>
                        <option>Insider</option>
                        <option>Salesforce Marketing Cloud</option>
                        <option>In-house / Custom</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom:var(--space-4)">
                    <label class="form-label">Deal Context (optional)</label>
                    <input id="oc-context" class="form-input" placeholder="e.g., E-commerce company, $100K deal, evaluating 3 vendors" />
                </div>
                <button class="btn btn-primary btn-lg" onclick="ObjectionCrusher.crush()" style="width:100%">
                    💪 Crush Objection
                </button>
            </div>

            <div class="glass-card module-panel">
                <div class="result-header">
                    <h2>🎯 Response Strategy</h2>
                    <button class="btn btn-sm btn-secondary" onclick="window.App.copyToClipboard('oc-result')">📋 Copy</button>
                </div>
                <div id="oc-result" class="result-content" style="max-height:500px;">
                    <div class="empty-state">
                        <div class="empty-state-icon">💪</div>
                        <h3>Enter an objection</h3>
                        <p>AI will generate a multi-layered response strategy with evidence and talk tracks.</p>
                    </div>
                </div>
            </div>
        </div>`;
    },

    init() { },

    async crush() {
        const objection = document.getElementById('oc-objection').value;
        const competitor = document.getElementById('oc-competitor').value;
        const context = document.getElementById('oc-context').value;
        const resultEl = document.getElementById('oc-result');

        if (!objection.trim()) { window.App.showToast('Enter an objection', 'warning'); return; }

        resultEl.innerHTML = '<div class="loading-shimmer" style="height:300px"></div>';

        const prompt = `As a Netcore Cloud presales expert, crush this sales objection:

Objection: "${objection}"
${competitor ? `Competitor: ${competitor}` : ''}
${context ? `Deal Context: ${context}` : ''}

**Required output:**

## 🎯 Quick Response (30 seconds)
A concise, confident verbal response for live conversations.

## 📊 Evidence-Based Rebuttal
| Claim | Reality | Netcore Advantage |
| --- | --- | --- |
| ... | ... | ... |

## 💬 Talk Tracks
3 different ways to address this objection, from different angles:
1. **Technical angle**: ...
2. **Business value angle**: ...
3. **Customer evidence angle**: ...

## 🔄 Redirect Strategy
How to pivot the conversation toward Netcore Cloud's strengths.

## ⚡ Killer Follow-Up Question
A question to ask the prospect that reinforces Netcore's position.`;

        const result = await GeminiService.generateContent(prompt, `You are a Netcore Cloud competitive sales expert. Counter objections with facts about Netcore's strengths: all-in-one platform, Raman AI personalization, superior email deliverability, Inbox Commerce (AMP), no-code Product Experience, Co-Marketer agentic AI, competitive pricing, and strong APAC presence.`);
        const badge = window.App.getAiBadge(result);

        if (result.success) {
            resultEl.innerHTML = `<div class="result-body">${window.MarkdownRenderer.parse(result.text)}</div><div class="result-meta">${badge}</div>`;
        } else {
            resultEl.innerHTML = `<div class="error-container" style="padding:var(--space-4); background:rgba(239,68,68,0.1); border-radius:var(--radius-md);"><div style="color:#f87171; font-weight:600;">❌ Failed</div><div style="color:var(--text-secondary);">${result.error}</div></div>`;
        }
    }
};

window.ObjectionCrusher = ObjectionCrusher;
export default ObjectionCrusher;
