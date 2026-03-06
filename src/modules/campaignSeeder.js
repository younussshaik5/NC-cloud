// ========================================
// Campaign Seeder (formerly Data Seeder)
// Seeds demo data into Netcore Cloud CE
// ========================================

import GeminiService from '../services/geminiService.js';
import NetcoreService from '../services/netcoreService.js';

const CampaignSeeder = {
    generatedData: null,

    render() {
        return `
        <div class="module-page">
            <div class="module-header">
                <h1>🌱 Campaign Seeder</h1>
                <p class="module-desc">AI-generated demo data — contacts, segments, events, and campaigns for Netcore Cloud CE.</p>
            </div>

            <div class="module-grid">
                <div class="glass-card module-panel">
                    <h2>📋 Demo Scenario</h2>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Industry / Use Case</label>
                        <select id="seed-industry" class="form-input">
                            <option>E-commerce (Fashion & Lifestyle)</option>
                            <option>E-commerce (Grocery & Essentials)</option>
                            <option>BFSI (Insurance)</option>
                            <option>BFSI (Banking / Lending)</option>
                            <option>EdTech</option>
                            <option>Fantasy Gaming</option>
                            <option>Travel & Hospitality</option>
                            <option>Media & Entertainment (OTT)</option>
                            <option>Food & Delivery</option>
                            <option>Health & Wellness</option>
                            <option>SaaS / B2B</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Company Name (for demo)</label>
                        <input id="seed-company" class="form-input" placeholder="e.g., StyleHub, QuickCart, PolicyPro" />
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Data Volume</label>
                        <select id="seed-volume" class="form-input">
                            <option value="small">Small (10 contacts, 3 segments, 2 campaigns)</option>
                            <option value="medium" selected>Medium (25 contacts, 5 segments, 5 campaigns)</option>
                            <option value="large">Large (50 contacts, 8 segments, 10 campaigns)</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:var(--space-4)">
                        <label class="form-label">Data Types to Generate</label>
                        <div class="chip-group" id="seed-types">
                            <button class="chip selected" data-type="contacts" onclick="CampaignSeeder.toggleType(this)">👥 Contacts</button>
                            <button class="chip selected" data-type="segments" onclick="CampaignSeeder.toggleType(this)">📊 Segments</button>
                            <button class="chip selected" data-type="campaigns" onclick="CampaignSeeder.toggleType(this)">📧 Campaigns</button>
                            <button class="chip" data-type="events" onclick="CampaignSeeder.toggleType(this)">⚡ Events</button>
                            <button class="chip" data-type="journeys" onclick="CampaignSeeder.toggleType(this)">🗺️ Journeys</button>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-lg" onclick="CampaignSeeder.generate()" style="width:100%">
                        🌱 Generate Demo Data
                    </button>
                </div>

                <div class="glass-card module-panel">
                    <div class="result-header">
                        <h2>📦 Generated Data</h2>
                        <div class="result-actions">
                            <button class="btn btn-sm btn-secondary" onclick="CampaignSeeder.copyJSON()">📋 Copy JSON</button>
                            <button class="btn btn-sm btn-secondary" onclick="CampaignSeeder.downloadJSON()">📥 Download</button>
                            <button class="btn btn-sm btn-primary" onclick="CampaignSeeder.pushToNetcore()">🚀 Push to Netcore CE</button>
                        </div>
                    </div>
                    <div id="seed-result" class="result-content" style="max-height:600px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">🌱</div>
                            <h3>Configure scenario above</h3>
                            <p>AI will generate realistic demo data tailored to your industry and push it to Netcore CE via API.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    selectedTypes: ['contacts', 'segments', 'campaigns'],

    init() { },

    toggleType(el) {
        el.classList.toggle('selected');
        this.selectedTypes = Array.from(document.querySelectorAll('#seed-types .chip.selected'))
            .map(c => c.dataset.type);
    },

    async generate() {
        const industry = document.getElementById('seed-industry').value;
        const company = document.getElementById('seed-company').value || 'DemoCompany';
        const volume = document.getElementById('seed-volume').value;
        const types = this.selectedTypes;
        const resultEl = document.getElementById('seed-result');

        resultEl.innerHTML = '<div class="loading-shimmer" style="height:400px"></div>';

        const volumeMap = {
            small: { contacts: 10, segments: 3, campaigns: 2 },
            medium: { contacts: 25, segments: 5, campaigns: 5 },
            large: { contacts: 50, segments: 8, campaigns: 10 }
        };
        const vol = volumeMap[volume];

        const prompt = `Generate realistic demo data for a Netcore Cloud CE demo. Return ONLY valid JSON, no markdown.

Industry: ${industry}
Company: ${company}
Data types: ${types.join(', ')}

Generate this JSON structure:
{
  ${types.includes('contacts') ? `"contacts": [
    // ${vol.contacts} contacts with: email, name, phone, city, attributes (industry-specific like signup_date, plan_type, last_purchase, etc.)
  ],` : ''}
  ${types.includes('segments') ? `"segments": [
    // ${vol.segments} segments with: name, description, rules (based on contact attributes)
  ],` : ''}
  ${types.includes('campaigns') ? `"campaigns": [
    // ${vol.campaigns} campaigns with: name, channel (email/sms/push/whatsapp), subject, type (promotional/transactional/triggered), status
  ],` : ''}
  ${types.includes('events') ? `"events": [
    // Sample events: event_name, contact_email, properties (industry-specific like product_viewed, cart_added, purchase_completed, etc.)
  ],` : ''}
  ${types.includes('journeys') ? `"journeys": [
    // Journey definitions: name, trigger, steps (channel + delay + condition)
  ]` : ''}
}

Make the data realistic for ${industry}. Use Indian names and cities for variety. Ensure emails use @example.com domain.`;

        const result = await GeminiService.generateContent(prompt, 'Generate ONLY valid JSON. No markdown, no code fences, no explanations. Just pure JSON.');

        if (result.success) {
            try {
                let jsonText = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                this.generatedData = JSON.parse(jsonText);
                const summary = Object.entries(this.generatedData).map(([k, v]) =>
                    `<div style="margin-bottom:var(--space-2)"><strong>${k}:</strong> ${Array.isArray(v) ? v.length + ' items' : 'configured'}</div>`
                ).join('');

                resultEl.innerHTML = `
                    <div style="margin-bottom:var(--space-4)">${summary}</div>
                    <pre style="background:rgba(0,0,0,0.3); padding:var(--space-4); border-radius:var(--radius-md); overflow:auto; max-height:400px; font-size:12px; color:var(--text-secondary);">${JSON.stringify(this.generatedData, null, 2)}</pre>
                    <div class="result-meta">${window.App.getAiBadge(result)}</div>
                `;
            } catch (e) {
                resultEl.innerHTML = `
                    <div class="result-body">${window.MarkdownRenderer.parse(result.text)}</div>
                    <div class="result-meta">${window.App.getAiBadge(result)}</div>
                `;
            }
        } else {
            resultEl.innerHTML = `<div class="error-container" style="padding:var(--space-4); background:rgba(239,68,68,0.1); border-radius:var(--radius-md);"><div style="color:#f87171; font-weight:600;">❌ Generation Failed</div><div style="color:var(--text-secondary);">${result.error}</div></div>`;
        }
    },

    async pushToNetcore() {
        if (!this.generatedData) {
            window.App.showToast('Generate data first', 'warning');
            return;
        }
        if (!NetcoreService.isConnected()) {
            window.App.showToast('Connect to Netcore Cloud in Settings first', 'warning');
            return;
        }

        const resultEl = document.getElementById('seed-result');
        let log = '<div style="font-family:monospace; font-size:13px;">';
        let successCount = 0;
        let failCount = 0;

        // Push contacts
        if (this.generatedData.contacts) {
            log += '<div style="color:var(--primary); font-weight:600; margin-bottom:var(--space-2);">📤 Pushing contacts...</div>';
            const contactResult = await NetcoreService.bulkAddContacts(this.generatedData.contacts);
            if (contactResult.success) {
                successCount += this.generatedData.contacts.length;
                log += `<div style="color:#34d399;">✅ ${this.generatedData.contacts.length} contacts pushed</div>`;
            } else {
                failCount++;
                log += `<div style="color:#f87171;">❌ Contacts failed: ${contactResult.error}</div>`;
            }
        }

        // Push lists/segments
        if (this.generatedData.segments) {
            log += '<div style="color:var(--primary); font-weight:600; margin:var(--space-2) 0;">📤 Creating segments...</div>';
            for (const seg of this.generatedData.segments) {
                const r = await NetcoreService.createList({ name: seg.name, description: seg.description });
                if (r.success) { successCount++; log += `<div style="color:#34d399;">✅ Segment: ${seg.name}</div>`; }
                else { failCount++; log += `<div style="color:#f87171;">❌ ${seg.name}: ${r.error}</div>`; }
                await new Promise(r => setTimeout(r, 200));
            }
        }

        log += `<div style="margin-top:var(--space-4); font-weight:600;">Done! ✅ ${successCount} succeeded, ❌ ${failCount} failed</div></div>`;
        resultEl.innerHTML = log;
        window.App.showToast(`Pushed ${successCount} items to Netcore CE`, successCount > 0 ? 'success' : 'danger');
    },

    copyJSON() {
        if (!this.generatedData) { window.App.showToast('No data to copy', 'warning'); return; }
        navigator.clipboard.writeText(JSON.stringify(this.generatedData, null, 2));
        window.App.showToast('JSON copied!', 'success');
    },

    downloadJSON() {
        if (!this.generatedData) { window.App.showToast('No data to download', 'warning'); return; }
        const blob = new Blob([JSON.stringify(this.generatedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'netcore-demo-data.json';
        a.click();
        URL.revokeObjectURL(url);
        window.App.showToast('Downloaded!', 'success');
    }
};

window.CampaignSeeder = CampaignSeeder;
export default CampaignSeeder;
