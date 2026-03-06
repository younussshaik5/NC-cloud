// ========================================
// Module 8: Technical Utilities (Container)
// ========================================

import EmailAssist from './tech/emailAssist.js';
import RfpHelper from './tech/rfpHelper.js';
import ObjectionCrusher from './tech/objectionCrusher.js';

const TechUtilities = {
    currentTab: 'email',

    render() {
        return `
        <div class="module-page">
            <div class="module-header">
                <h1>✉️ Tech Utilities</h1>
                <p class="module-desc">Presales productivity tools — email drafting, RFP responses, and objection handling.</p>
            </div>

            <div class="tabs" style="margin-bottom:var(--space-6)">
                <button class="tab active" data-tab="email" onclick="TechUtilities.switchTab(this)">✉️ Email Assist</button>
                <button class="tab" data-tab="rfp" onclick="TechUtilities.switchTab(this)">📄 RFP Helper</button>
                <button class="tab" data-tab="objection" onclick="TechUtilities.switchTab(this)">💪 Objection Crusher</button>
            </div>

            <div id="tu-tab-email" class="tab-content active">${EmailAssist.render()}</div>
            <div id="tu-tab-rfp" class="tab-content" style="display:none">${RfpHelper.render()}</div>
            <div id="tu-tab-objection" class="tab-content" style="display:none">${ObjectionCrusher.render()}</div>
        </div>`;
    },

    init() {
        EmailAssist.init?.();
        RfpHelper.init?.();
        ObjectionCrusher.init?.();
    },

    switchTab(el) {
        document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
        el.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        document.getElementById(`tu-tab-${el.dataset.tab}`).style.display = 'block';
    }
};

window.TechUtilities = TechUtilities;
export default TechUtilities;
