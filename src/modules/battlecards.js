// ========================================
// Module 4: Competitive Battlecards
// Netcore Cloud vs Competitors
// ========================================

import GeminiService from '../services/geminiService.js';

const Battlecards = {
    render() {
        return `
        <div class="module-page">
            <div class="module-header">
                <h1>⚔️ Battlecards</h1>
                <p class="module-desc">AI-generated competitive intelligence against MoEngage, CleverTap, Braze, and more.</p>
            </div>

            <div class="module-grid">
                <div class="glass-card module-panel">
                    <h2>🎯 Competitive Context</h2>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Competitor</label>
                        <select id="bc-competitor" class="form-input">
                            <option value="">Select Competitor</option>
                            <option>MoEngage</option>
                            <option>CleverTap</option>
                            <option>Braze</option>
                            <option>Iterable</option>
                            <option>WebEngage</option>
                            <option>Insider</option>
                            <option>Salesforce Marketing Cloud</option>
                            <option>Adobe Marketo</option>
                            <option>HubSpot</option>
                            <option>Twilio Segment + SendGrid</option>
                            <option>Custom / In-house</option>
                            <option>Other (specify in notes)</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Industry</label>
                        <input id="bc-industry" class="form-input" placeholder="e.g., E-commerce, BFSI, Gaming" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Netcore Products in Play</label>
                        <div class="chip-group" id="bc-products">
                            <button class="chip selected" data-product="CE Platform" onclick="Battlecards.toggleProduct(this)">📱 CE Platform</button>
                            <button class="chip" data-product="Email API" onclick="Battlecards.toggleProduct(this)">✉️ Email API</button>
                            <button class="chip" data-product="Personalization" onclick="Battlecards.toggleProduct(this)">🎯 Personalization</button>
                            <button class="chip" data-product="Product Experience" onclick="Battlecards.toggleProduct(this)">💡 Product Experience</button>
                            <button class="chip" data-product="Inbox Commerce" onclick="Battlecards.toggleProduct(this)">🛒 Inbox Commerce</button>
                            <button class="chip" data-product="Co-Marketer AI" onclick="Battlecards.toggleProduct(this)">🤖 Co-Marketer AI</button>
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Deal Context / Specific Concerns</label>
                        <textarea id="bc-context" class="form-textarea" rows="6" placeholder="Any specifics about the competitive situation:
• Why the customer is considering the competitor
• Specific features they're comparing
• Pricing concerns
• Integration requirements
• Customer pain points"></textarea>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <div style="display:flex; align-items:center; gap:var(--space-2); flex-wrap:wrap;">
                            <input type="file" id="bc-file" class="form-input" multiple disabled style="flex:1; opacity:0.6; cursor:not-allowed;" />
                            <span style="color:#f87171; font-size:var(--font-xs); font-weight:600;">⚠️ shaik has disabled the file input , as model run on credits</span>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-lg" onclick="Battlecards.generate()" style="width:100%">
                        ⚔️ Generate Battlecard
                    </button>
                </div>

                <div class="glass-card module-panel">
                    <div class="result-header">
                        <h2>🏆 Battlecard</h2>
                        <div class="result-actions">
                            <button class="btn btn-sm btn-secondary" onclick="Battlecards.copy()">📋 Copy</button>
                            <button class="btn btn-sm btn-secondary" onclick="Battlecards.slack()">💬 Slack</button>
                        </div>
                    </div>
                    <div id="bc-result" class="result-content" style="max-height:600px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">⚔️</div>
                            <h3>Select a competitor above</h3>
                            <p>AI will generate a comprehensive battlecard with win strategies, objection handling, and displacement tactics.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    selectedProducts: ['CE Platform'],

    init() { },

    toggleProduct(el) {
        el.classList.toggle('selected');
        this.selectedProducts = Array.from(document.querySelectorAll('#bc-products .chip.selected'))
            .map(c => c.dataset.product);
    },

    async generate() {
        const competitor = document.getElementById('bc-competitor').value;
        const industry = document.getElementById('bc-industry').value;
        const context = document.getElementById('bc-context').value;
        const products = this.selectedProducts.join(', ');
        const resultEl = document.getElementById('bc-result');

        if (!competitor) {
            window.App.showToast('Select a competitor', 'warning');
            return;
        }

        resultEl.innerHTML = '<div class="loading-shimmer" style="height:400px"></div>';

        const fileInput = document.getElementById('bc-file');
        const attachments = [];
        if (fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                attachments.push(await window.App.readFile(file));
            }
        }

        const prompt = `Generate a comprehensive competitive battlecard: Netcore Cloud vs ${competitor}

Industry: ${industry || 'General'}
Netcore Products: ${products}
Deal Context: ${context || 'General competitive comparison'}

**Required output structure:**

## 🏢 Competitor Overview: ${competitor}
Brief overview of ${competitor}'s positioning, target market, and recent developments.

## ⚡ Quick Comparison Matrix
| Capability | Netcore Cloud | ${competitor} | Winner |
| --- | --- | --- | --- |
| Omnichannel Engagement | ... | ... | 🏆 |
| Email Deliverability | ... | ... | ... |
| AI / ML Capabilities | ... | ... | ... |
| Personalization Depth | ... | ... | ... |
| Product Experience (Nudges) | ... | ... | ... |
| CDP / Data Unification | ... | ... | ... |
| Inbox Commerce (AMP) | ... | ... | ... |
| Journey Orchestration | ... | ... | ... |
| Analytics & Reporting | ... | ... | ... |
| Pricing / Value | ... | ... | ... |
| Implementation Speed | ... | ... | ... |
| Customer Support | ... | ... | ... |

## 🏆 Netcore Cloud Win Themes
Top 3-5 reasons why Netcore wins:
1. **[Theme]** — Explanation
2. ...

## ⚠️ Where ${competitor} Claims Advantage
Honest assessment + our counter:
| Their Claim | Reality | Our Response |
| --- | --- | --- |
| ... | ... | ... |

## 💬 Objection Handling
| Objection | Response |
| --- | --- |
| "Why should we switch from ${competitor}?" | ... |
| "${competitor} has better [X]" | ... |
| "${competitor} is cheaper" | ... |
| "We're already invested in ${competitor}" | ... |

## 🎯 Displacement Strategy
Step-by-step plan to displace ${competitor}:
1. **Discovery**: Key questions to surface ${competitor}'s weaknesses
2. **Proof**: Specific Netcore capabilities to demonstrate
3. **ROI**: Cost/value comparison approach
4. **Migration**: How to address switching concerns

## 📊 Customer Evidence
Reference customers who switched from ${competitor} to Netcore (or similar competitive wins).

## 🔑 Killer Questions
5 questions to ask the prospect that expose ${competitor}'s weaknesses.`;

        const result = await GeminiService.generateContent(prompt, `You are a Netcore Cloud competitive intelligence expert. Be factual but position Netcore favorably. Key Netcore strengths: all-in-one platform (CE + Email API + Personalization + Product Experience + Inbox Commerce), Raman AI for 1:1 personalization, Co-Marketer agentic AI, superior email deliverability, AMP email / Inbox Commerce, no-code Product Experience, and competitive pricing.`, attachments);
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
        window.App.copyToClipboard('bc-result');
    },

    slack() {
        const el = document.getElementById('bc-result');
        import('../services/slackService.js').then(mod => {
            mod.default.sendMessage(`⚔️ *Netcore Cloud Battlecard*\n\n${el.innerText}`);
            window.App.showToast('Sent to Slack!', 'success');
        });
    }
};

window.Battlecards = Battlecards;
export default Battlecards;
