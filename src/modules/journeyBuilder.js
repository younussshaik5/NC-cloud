// ========================================
// Journey Builder Config (Netcore Cloud)
// Generates customer journey configurations
// ========================================

import GeminiService from '../services/geminiService.js';

const JourneyBuilder = {
    render() {
        return `
        <div class="module-page">
            <div class="module-header">
                <h1>🗺️ Journey Builder</h1>
                <p class="module-desc">AI-powered customer journey design for Netcore Cloud CE — from triggers to multi-channel flows.</p>
            </div>

            <div class="module-grid">
                <div class="glass-card module-panel">
                    <h2>⚡ Journey Configuration</h2>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Journey Type</label>
                        <select id="jb-type" class="form-input">
                            <option>User Onboarding</option>
                            <option>Cart Abandonment Recovery</option>
                            <option>Re-Engagement / Winback</option>
                            <option>Post-Purchase Nurture</option>
                            <option>Upsell / Cross-sell</option>
                            <option>Subscription Renewal</option>
                            <option>Event-Based Trigger</option>
                            <option>Loyalty / Rewards</option>
                            <option>Feedback & NPS Collection</option>
                            <option>Custom (describe below)</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Industry</label>
                        <input id="jb-industry" class="form-input" placeholder="e.g., E-commerce, BFSI, EdTech" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Channels to Use</label>
                        <div class="chip-group" id="jb-channels">
                            <button class="chip selected" data-ch="Email" onclick="JourneyBuilder.toggleChannel(this)">✉️ Email</button>
                            <button class="chip selected" data-ch="Push" onclick="JourneyBuilder.toggleChannel(this)">🔔 Push</button>
                            <button class="chip" data-ch="SMS" onclick="JourneyBuilder.toggleChannel(this)">📱 SMS</button>
                            <button class="chip" data-ch="WhatsApp" onclick="JourneyBuilder.toggleChannel(this)">💬 WhatsApp</button>
                            <button class="chip" data-ch="In-App" onclick="JourneyBuilder.toggleChannel(this)">📲 In-App</button>
                            <button class="chip" data-ch="Web Push" onclick="JourneyBuilder.toggleChannel(this)">🌐 Web Push</button>
                            <button class="chip" data-ch="RCS" onclick="JourneyBuilder.toggleChannel(this)">💎 RCS</button>
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Business Context / Requirements</label>
                        <textarea id="jb-context" class="form-textarea" rows="6" placeholder="Describe the journey goal, target audience, and any specific requirements...

Example: 'We want to re-engage users who haven't opened the app in 14 days. They should get a personalized email first, then a push notification with a discount if they don't engage within 48 hours...'"></textarea>
                    </div>
                    <button class="btn btn-primary btn-lg" onclick="JourneyBuilder.generate()" style="width:100%">
                        🗺️ Generate Journey
                    </button>
                </div>

                <div class="glass-card module-panel">
                    <div class="result-header">
                        <h2>📋 Journey Design</h2>
                        <div class="result-actions">
                            <button class="btn btn-sm btn-secondary" onclick="JourneyBuilder.copy()">📋 Copy</button>
                            <button class="btn btn-sm btn-secondary" onclick="JourneyBuilder.download()">📥 Download</button>
                        </div>
                    </div>
                    <div id="jb-result" class="result-content" style="max-height:600px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">🗺️</div>
                            <h3>Configure journey above</h3>
                            <p>AI will design a complete multi-channel customer journey with timing, content, and optimization suggestions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    selectedChannels: ['Email', 'Push'],

    init() { },

    toggleChannel(el) {
        el.classList.toggle('selected');
        this.selectedChannels = Array.from(document.querySelectorAll('#jb-channels .chip.selected'))
            .map(c => c.dataset.ch);
    },

    async generate() {
        const type = document.getElementById('jb-type').value;
        const industry = document.getElementById('jb-industry').value;
        const context = document.getElementById('jb-context').value;
        const channels = this.selectedChannels.join(', ');
        const resultEl = document.getElementById('jb-result');

        resultEl.innerHTML = '<div class="loading-shimmer" style="height:400px"></div>';

        const prompt = `Design a comprehensive customer journey for Netcore Cloud CE:

Journey Type: ${type}
Industry: ${industry || 'General'}
Channels: ${channels}
Context: ${context || 'Standard implementation'}

**Required output structure:**

## Journey Overview
| Attribute | Value |
| --- | --- |
| Name | ... |
| Goal | ... |
| Target Segment | ... |
| Trigger | ... |
| Expected Duration | ... |
| KPIs | ... |

## Entry Criteria
- Trigger event or condition
- Segment definition
- Frequency capping rules

## Journey Flow

### Step 1: [Trigger / Entry]
- **Timing**: Immediate / Delay
- **Channel**: ${channels.split(', ')[0]}
- **Content**: Subject/title + brief message description
- **Personalization**: Dynamic fields to use
- **Wait Condition**: ...

### Step 2: [Follow-up]
- **Timing**: +Xh/d from previous step
- **Condition**: If user did/didn't [action]
- **Channel**: ...
- **Content**: ...

(Continue for all steps in the journey — typically 5-8 steps)

### Decision Nodes
Describe any split/branch logic:
| Condition | Yes Path | No Path |
| --- | --- | --- |
| Opened email? | ... | ... |
| Clicked CTA? | ... | ... |

## Content Templates
For each message in the journey, provide:
- **Subject line** (for email)
- **Preview text**
- **Key message**
- **CTA button text**
- **Personalization tokens** (e.g., {{first_name}}, {{last_product}})

## AI Optimization Opportunities
Using Netcore's Co-Marketer AI:
- Send-time optimization recommendation
- Content variant suggestions for A/B testing
- Predictive segment recommendations
- Channel preference optimization

## Exit Criteria
- When should a user exit this journey
- Conflict resolution with other journeys

## Expected Performance Benchmarks
| Metric | Industry Avg | Target |
| --- | --- | --- |
| Open Rate | ... | ... |
| Click Rate | ... | ... |
| Conversion | ... | ... |`;

        const result = await GeminiService.generateContent(prompt, 'You are a Netcore Cloud journey design expert. Create detailed, actionable journey flows that leverage Netcore CE capabilities including Co-Marketer AI, send-time optimization, predictive segmentation, and omnichannel orchestration.');
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
                    <div style="color:var(--text-secondary);">${result.error}</div>
                </div>
            `;
        }
    },

    copy() {
        window.App.copyToClipboard('jb-result');
    },

    download() {
        const el = document.getElementById('jb-result');
        if (!el || !el.innerText.trim()) { window.App.showToast('No journey to download', 'warning'); return; }
        const blob = new Blob([el.innerHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'netcore-journey-design.html';
        a.click();
        URL.revokeObjectURL(url);
        window.App.showToast('Journey design downloaded!', 'success');
    }
};

window.JourneyBuilder = JourneyBuilder;
export default JourneyBuilder;
