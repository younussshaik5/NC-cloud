// ========================================
// Module 1: Demo Strategy (Discovery, Build, Script)
// Netcore Cloud Presales Intelligence
// ========================================

import GeminiService from '../services/geminiService.js';

const DemoStrategy = {
    render() {
        return `
        <div class="module-page">
            <div class="module-header">
                <h1>🎯 Demo Strategy</h1>
                <p class="module-desc">AI-powered demo planning for Netcore Cloud — from discovery to demo script.</p>
            </div>

            <div class="module-grid">
                <!-- Input Panel -->
                <div class="glass-card module-panel">
                    <h2>📋 Discovery Input</h2>

                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Company / Prospect</label>
                        <input id="ds-company" class="form-input" placeholder="e.g., BigBasket, PolicyBazaar, Dream11" />
                    </div>

                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Industry</label>
                        <select id="ds-industry" class="form-input">
                            <option value="">Select Industry</option>
                            <option>E-commerce & Retail</option>
                            <option>BFSI (Banking, Financial Services, Insurance)</option>
                            <option>Media & Entertainment</option>
                            <option>Travel & Hospitality</option>
                            <option>EdTech</option>
                            <option>Fantasy Gaming</option>
                            <option>Food & Delivery</option>
                            <option>Health & Wellness</option>
                            <option>SaaS / Technology</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Netcore Products of Interest</label>
                        <div class="chip-group" id="ds-products">
                            <button class="chip selected" data-product="CE Platform" onclick="DemoStrategy.toggleProduct(this)">📱 CE Platform</button>
                            <button class="chip" data-product="Email API" onclick="DemoStrategy.toggleProduct(this)">✉️ Email API</button>
                            <button class="chip" data-product="Personalization" onclick="DemoStrategy.toggleProduct(this)">🎯 Personalization</button>
                            <button class="chip" data-product="Product Experience" onclick="DemoStrategy.toggleProduct(this)">💡 Product Experience</button>
                            <button class="chip" data-product="Inbox Commerce" onclick="DemoStrategy.toggleProduct(this)">🛒 Inbox Commerce</button>
                            <button class="chip" data-product="Co-Marketer AI" onclick="DemoStrategy.toggleProduct(this)">🤖 Co-Marketer AI</button>
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Discovery Notes / Call Transcript</label>
                        <textarea id="ds-notes" class="form-textarea" rows="10" placeholder="Paste discovery call notes, meeting summaries, or deal context...

Key areas to include:
• Current martech stack and pain points
• Channels used (Email, SMS, Push, WhatsApp, etc.)
• Key metrics: MAU, DAU, email volume, conversion rates
• Integration requirements (CDP, CRM, Analytics)
• Budget and timeline expectations
• Decision makers and stakeholders"></textarea>
                    </div>

                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Attachments (RFP, Architecture Docs)</label>
                        <input type="file" id="ds-file" class="form-input" multiple />
                    </div>

                    <div style="display:flex;gap:var(--space-3)">
                        <button class="btn btn-primary btn-lg" onclick="DemoStrategy.analyzeDiscovery()" style="flex:1">
                            🔍 Analyze Discovery
                        </button>
                    </div>
                </div>

                <!-- Results Panel -->
                <div class="glass-card module-panel">
                    <div class="tabs" style="margin-bottom:var(--space-4)">
                        <button class="tab active" data-tab="discovery" onclick="DemoStrategy.switchTab(this)">🔍 Discovery</button>
                        <button class="tab" data-tab="build" onclick="DemoStrategy.switchTab(this)">🏗️ Build Plan</button>
                        <button class="tab" data-tab="script" onclick="DemoStrategy.switchTab(this)">🎬 Demo Script</button>
                    </div>

                    <div id="tab-discovery" class="tab-content active">
                        <div class="result-header">
                            <h2>🔍 Discovery Analysis</h2>
                            <div class="result-actions">
                                <button class="btn btn-sm btn-secondary" onclick="DemoStrategy.copyResult('discovery')">📋 Copy</button>
                                <button class="btn btn-sm btn-secondary" onclick="DemoStrategy.shareToSlack('discovery')">💬 Slack</button>
                            </div>
                        </div>
                        <div id="ds-discovery-result" class="result-content" style="max-height:600px;">
                            <div class="empty-state">
                                <div class="empty-state-icon">🔍</div>
                                <h3>Paste discovery notes above</h3>
                                <p>AI will analyze customer needs and map them to Netcore Cloud's product suite.</p>
                            </div>
                        </div>
                    </div>

                    <div id="tab-build" class="tab-content" style="display:none">
                        <div class="result-header">
                            <h2>🏗️ Demo Build Plan</h2>
                            <div class="result-actions">
                                <button class="btn btn-sm btn-secondary" onclick="DemoStrategy.copyResult('build')">📋 Copy</button>
                            </div>
                        </div>
                        <div id="ds-build-result" class="result-content" style="max-height:600px;">
                            <div class="empty-state">
                                <div class="empty-state-icon">🏗️</div>
                                <h3>Run Discovery Analysis first</h3>
                                <p>Then click "Build Plan" to generate a tailored demo configuration.</p>
                            </div>
                        </div>
                    </div>

                    <div id="tab-script" class="tab-content" style="display:none">
                        <div class="result-header">
                            <h2>🎬 Demo Script</h2>
                            <div class="result-actions">
                                <button class="btn btn-sm btn-secondary" onclick="DemoStrategy.copyResult('script')">📋 Copy</button>
                            </div>
                        </div>
                        <div id="ds-script-result" class="result-content" style="max-height:600px;">
                            <div class="empty-state">
                                <div class="empty-state-icon">🎬</div>
                                <h3>Run Discovery first</h3>
                                <p>Then generate a custom demo script for your presentation.</p>
                            </div>
                        </div>
                    </div>

                    <div style="display:flex;gap:var(--space-3);margin-top:var(--space-4)">
                        <button class="btn btn-secondary" onclick="DemoStrategy.generateBuild()" style="flex:1">🏗️ Generate Build Plan</button>
                        <button class="btn btn-secondary" onclick="DemoStrategy.generateScript()" style="flex:1">🎬 Generate Script</button>
                    </div>
                </div>
            </div>
        </div>`;
    },

    selectedProducts: ['CE Platform'],

    init() {
        // Tab switching
        document.querySelectorAll('.tab-content').forEach((el, i) => {
            if (i > 0) el.style.display = 'none';
        });
    },

    toggleProduct(el) {
        el.classList.toggle('selected');
        this.selectedProducts = Array.from(document.querySelectorAll('#ds-products .chip.selected'))
            .map(c => c.dataset.product);
    },

    switchTab(el) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        el.classList.add('active');
        document.getElementById(`tab-${el.dataset.tab}`).style.display = 'block';
    },

    discoveryContext: '',

    async analyzeDiscovery() {
        const company = document.getElementById('ds-company').value;
        const industry = document.getElementById('ds-industry').value;
        const notes = document.getElementById('ds-notes').value;
        const products = this.selectedProducts.join(', ');
        const resultEl = document.getElementById('ds-discovery-result');

        if (!notes.trim()) {
            window.App.showToast('Please enter discovery notes', 'warning');
            return;
        }

        resultEl.innerHTML = '<div class="loading-shimmer" style="height:400px"></div>';

        const fileInput = document.getElementById('ds-file');
        const attachments = [];
        if (fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                attachments.push(await window.App.readFile(file));
            }
        }

        const prompt = `You are a Netcore Cloud Solution Presales Consultant analyzing a discovery call.

Company: ${company || 'Not specified'}
Industry: ${industry || 'Not specified'}
Products of Interest: ${products}

Discovery Notes:
${notes}

Analyze the attached documents if any.

**Required output structure:**

## Customer Profile
| Attribute | Details |
| --- | --- |
| Company | ... |
| Industry | ... |
| Size / Scale | ... |
| Current MarTech Stack | ... |
| Key Decision Makers | ... |

## Pain Points & Needs Mapping
Map each identified pain point to the relevant Netcore Cloud solution:
| Pain Point | Netcore Solution | Product Module |
| --- | --- | --- |
| ... | ... | CE / Email API / Personalization / Product Experience / Inbox Commerce / Co-Marketer AI |

## Channel Assessment
| Channel | Current State | Netcore Capability | Opportunity |
| --- | --- | --- | --- |
| Email | ... | ... | ... |
| SMS | ... | ... | ... |
| Push (App/Web) | ... | ... | ... |
| WhatsApp | ... | ... | ... |
| In-App | ... | ... | ... |
| RCS | ... | ... | ... |

## Recommended Netcore Product Mix
For each recommended product, explain why:
1. **Product Name** — Rationale
2. ...

## Competitive Landscape
If any competing platforms are mentioned (MoEngage, CleverTap, Braze, WebEngage, etc.), provide:
- What they're using today
- Where Netcore wins
- Key displacement arguments

## Key Metrics to Highlight in Demo
List 3-5 specific metrics or ROI points to emphasize during the demo.

## Risk Factors
Flag any potential risks or blockers (integration complexity, budget constraints, internal champions, etc.)`;

        const systemInstruction = `You are an expert Netcore Cloud Solution Presales Consultant with deep knowledge of:
- Customer Engagement (CE) Platform: omnichannel journeys, segmentation, automation
- Email API: transactional & marketing email delivery at scale
- Personalization (Raman AI): 1:1 web/app personalization, product recommendations
- Product Experience: no-code nudges, walkthroughs, tooltips, surveys
- Inbox Commerce: AMP emails for in-email shopping experiences
- Co-Marketer AI: agentic marketing with Content, Insights, Segment, and Merchandiser agents
- CDP: unified customer data platform
- Channels: Email, SMS, WhatsApp, App Push, Web Push, In-App, RCS, Web Messages

Always position Netcore Cloud's strengths and map customer needs to specific product capabilities.`;

        const result = await GeminiService.generateContent(prompt, systemInstruction, attachments);
        const badge = window.App.getAiBadge(result);

        if (result.success) {
            this.discoveryContext = result.text;
            resultEl.innerHTML = `
                <div class="result-body">${window.MarkdownRenderer.parse(result.text)}</div>
                <div class="result-meta">${badge}</div>
            `;
        } else {
            resultEl.innerHTML = `
                <div class="error-container" style="padding:var(--space-4); background:rgba(239,68,68,0.1); border-radius:var(--radius-md); border:1px solid rgba(239,68,68,0.2);">
                    <div style="color:#f87171; font-weight:600; margin-bottom:var(--space-2);">❌ AI Generation Failed</div>
                    <div style="color:var(--text-secondary); font-size:var(--font-sm);">${result.error || 'Unknown error occurred'}</div>
                </div>
            `;
        }
    },

    async generateBuild() {
        if (!this.discoveryContext) {
            window.App.showToast('Run Discovery Analysis first', 'warning');
            return;
        }

        // Switch to build tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        document.querySelector('[data-tab="build"]').classList.add('active');
        document.getElementById('tab-build').style.display = 'block';

        const resultEl = document.getElementById('ds-build-result');
        resultEl.innerHTML = '<div class="loading-shimmer" style="height:400px"></div>';

        const prompt = `Based on this discovery analysis, create a detailed Demo Build Plan for Netcore Cloud:

${this.discoveryContext}

**Required output structure:**

## Demo Environment Setup
| Component | Configuration | Priority |
| --- | --- | --- |
| CE Dashboard | ... | P0/P1/P2 |
| Segments | ... | ... |
| Journeys | ... | ... |
| Email Templates | ... | ... |
| Push Config | ... | ... |
| Personalization Rules | ... | ... |

## Demo Flow (Step by Step)
For each step:
### Step N: [Title]
- **Product Module**: CE / Email API / Personalization / etc.
- **What to Show**: Specific feature
- **Talk Track**: Key message for this step
- **Wow Moment**: What will impress the prospect

## Sample Data Required
List specific data to seed for the demo (contacts, events, campaigns, etc.)

## Integration Points to Demonstrate
If relevant, list integrations to show (Shopify, Segment, GA, CRM, etc.)

## Personalization Scenarios
Specific personalization rules to configure for the demo.

## Expected Demo Duration
Breakdown by section with time estimates.`;

        const result = await GeminiService.generateContent(prompt, 'You are a Netcore Cloud presales expert creating a demo build plan. Be specific about which Netcore features to configure.');
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

    async generateScript() {
        if (!this.discoveryContext) {
            window.App.showToast('Run Discovery Analysis first', 'warning');
            return;
        }

        // Switch to script tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        document.querySelector('[data-tab="script"]').classList.add('active');
        document.getElementById('tab-script').style.display = 'block';

        const resultEl = document.getElementById('ds-script-result');
        resultEl.innerHTML = '<div class="loading-shimmer" style="height:400px"></div>';

        const prompt = `Based on this discovery analysis, create a compelling Demo Script for Netcore Cloud:

${this.discoveryContext}

**Required output structure:**

## Opening (2 minutes)
- Agenda setting
- Customer-specific hook
- Value proposition framing

## Product Walkthrough

### Act 1: [Customer Engagement Dashboard] (5 min)
**Screen**: [What to show]
**Say**: "..."
**Do**: [Click/navigate actions]
**Wow Moment**: [Specific impressive stat or feature]

### Act 2: [Journey Builder] (5 min)
...

### Act 3: [Personalization / Raman AI] (5 min)
...

### Act 4: [Analytics & Insights] (3 min)
...

## Competitive Differentiators (2 min)
Key points to emphasize vs competition.

## ROI / Value Summary (2 min)
Customer-specific business impact.

## Close & Next Steps (1 min)
- Proposed POC / pilot approach
- Timeline and success criteria

## Objection Handling Cheat Sheet
| Likely Objection | Response |
| --- | --- |
| ... | ... |`;

        const result = await GeminiService.generateContent(prompt, 'You are a Netcore Cloud presales expert writing a demo script. Be natural, conversational, and customer-centric. Include specific talk tracks.');
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

    copyResult(type) {
        window.App.copyToClipboard(`ds-${type}-result`);
    },

    shareToSlack(type) {
        const el = document.getElementById(`ds-${type}-result`);
        import('../services/slackService.js').then(mod => {
            mod.default.sendMessage(`🎯 *Netcore Cloud Demo Strategy — ${type}*\n\n${el.innerText}`);
            window.App.showToast('Sent to Slack!', 'success');
        });
    }
};

window.DemoStrategy = DemoStrategy;
export default DemoStrategy;
