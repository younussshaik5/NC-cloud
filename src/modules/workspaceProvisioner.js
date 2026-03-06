// ========================================
// Workspace Provisioner — Netcore Cloud CE
// AI-Powered Demo Workspace Setup
// 3-Phase: Discovery → Tiles → Execute
// ========================================

import GeminiService from '../services/geminiService.js';
import NetcoreService from '../services/netcoreService.js';

const WorkspaceProvisioner = {
    phase: 'discovery',
    messages: [],
    attachments: [],
    tiles: [],
    executionLog: [],

    dependencyOrder: [
        'lists', 'contacts', 'segments', 'events',
        'email_templates', 'push_configs', 'sms_templates', 'whatsapp_templates',
        'campaigns', 'journeys', 'personalization_rules', 'nudge_configs'
    ],

    render() {
        return `
        <div class="module-page">
            <div class="module-header">
                <h1>🏗️ Workspace Provisioner</h1>
                <p class="module-desc">AI-powered Netcore Cloud CE workspace setup — from discovery to full provisioning via API.</p>
            </div>
            
            <div class="glass-card" style="margin-top:var(--space-8); padding:var(--space-12); text-align:center; display:flex; flex-direction:column; align-items:center; gap:var(--space-6); background:rgba(0,0,0,0.3); border:1px dashed var(--border-default);">
                <div style="font-size:4rem; filter:drop-shadow(0 0 20px var(--accent-primary-glow));">🏗️</div>
                <div style="max-width:500px;">
                    <h2 style="font-size:var(--font-2xl); margin-bottom:var(--space-2); background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">its under building</h2>
                    <p style="color:var(--text-tertiary); font-size:var(--font-lg); line-height:1.6;">
                        This agent is currently being optimized for Netcore Cloud's advanced CE APIs. 
                        We are building a more powerful automated provisioning engine for your demos.
                    </p>
                </div>
                <div class="loader-dots"><span></span><span></span><span></span></div>
            </div>
        </div>`;
    },

    renderPhase() {
        if (this.phase === 'discovery') return this.renderDiscovery();
        if (this.phase === 'tiles') return this.renderTiles();
        return '';
    },

    renderDiscovery() {
        return `
        <div class="module-grid">
            <div class="glass-card module-panel">
                <h2>💬 Discovery Chat</h2>
                <div id="wp-chat" style="max-height:400px; overflow-y:auto; margin-bottom:var(--space-4); padding:var(--space-3); background:rgba(0,0,0,0.2); border-radius:var(--radius-md);"></div>
                <div style="display:flex; gap:var(--space-2)">
                    <input id="wp-input" class="form-input" placeholder="Describe the demo workspace you need..." style="flex:1" onkeydown="if(event.key==='Enter') WorkspaceProvisioner.send()" />
                    <button class="btn btn-primary" onclick="WorkspaceProvisioner.send()">Send</button>
                </div>
                <div class="form-group" style="margin-top:var(--space-3)">
                    <div style="display:flex; align-items:center; gap:var(--space-2); flex-wrap:wrap;">
                        <input type="file" id="wp-file" class="form-input" multiple disabled style="flex:1; opacity:0.6; cursor:not-allowed;" />
                        <span style="color:#f87171; font-size:var(--font-xs); font-weight:600;">⚠️ shaik has disabled the file input , as model run on credits</span>
                    </div>
                </div>
            </div>
            <div class="glass-card module-panel">
                <h2>📋 Setup Summary</h2>
                <div id="wp-summary" class="result-content" style="max-height:400px;">
                    <div class="empty-state">
                        <div class="empty-state-icon">💬</div>
                        <h3>Describe your demo scenario</h3>
                        <p>Tell me about the prospect (industry, products, use case) and I'll plan the workspace setup.</p>
                    </div>
                </div>
                <button class="btn btn-primary btn-lg" onclick="WorkspaceProvisioner.generatePlan()" style="width:100%; margin-top:var(--space-4)">
                    🚀 Generate Setup Plan
                </button>
            </div>
        </div>`;
    },

    renderTiles() {
        const grouped = this.groupTilesByCategory();
        return `
        <div style="margin-bottom:var(--space-4); display:flex; gap:var(--space-3); flex-wrap:wrap; align-items:center;">
            <button class="btn btn-secondary" onclick="WorkspaceProvisioner.backToDiscovery()">← Back</button>
            <button class="btn btn-primary" onclick="WorkspaceProvisioner.executeAll()">🚀 Execute All</button>
            <button class="btn btn-secondary" onclick="WorkspaceProvisioner.exportResults()">📥 Export</button>
            <span style="color:var(--text-secondary); font-size:var(--font-sm);">
                ${this.tiles.filter(t => t.status === 'done').length}/${this.tiles.length} complete
            </span>
        </div>
        ${Object.entries(grouped).map(([cat, tiles]) => `
            <div style="margin-bottom:var(--space-6)">
                <h3 style="margin-bottom:var(--space-3); color:var(--text-secondary);">${cat}</h3>
                <div class="module-grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
                    ${tiles.map(t => this.renderSingleTile(t)).join('')}
                </div>
            </div>
        `).join('')}
        <div id="wp-exec-log" style="margin-top:var(--space-4); font-family:monospace; font-size:12px; max-height:200px; overflow-y:auto; padding:var(--space-3); background:rgba(0,0,0,0.2); border-radius:var(--radius-md);"></div>`;
    },

    renderSingleTile(tile) {
        const statusColors = { pending: '#6b7280', running: '#f59e0b', done: '#10b981', error: '#ef4444' };
        const statusIcons = { pending: '⏳', running: '🔄', done: '✅', error: '❌' };
        return `
        <div class="glass-card" id="tile-${tile.id}" style="padding:var(--space-4); border-left:3px solid ${statusColors[tile.status]}">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-2);">
                <strong>${statusIcons[tile.status]} ${tile.name}</strong>
                <span style="font-size:11px; color:${statusColors[tile.status]}">${tile.status.toUpperCase()}</span>
            </div>
            <div style="font-size:var(--font-sm); color:var(--text-secondary); margin-bottom:var(--space-3);">${tile.description || ''}</div>
            <div style="font-size:11px; color:var(--text-secondary); margin-bottom:var(--space-2);">
                <strong>API:</strong> ${tile.method} ${tile.endpoint}
            </div>
            <div style="display:flex; gap:var(--space-2);">
                <button class="btn btn-sm btn-primary" onclick="WorkspaceProvisioner.executeSingle('${tile.id}')">▶ Run</button>
                <button class="btn btn-sm btn-secondary" onclick="WorkspaceProvisioner.removeTile('${tile.id}')">🗑️</button>
            </div>
            ${tile.result ? `<div style="margin-top:var(--space-2); font-size:11px; padding:var(--space-2); background:rgba(0,0,0,0.2); border-radius:var(--radius-sm); max-height:80px; overflow:auto;">${tile.result}</div>` : ''}
        </div>`;
    },

    groupTilesByCategory() {
        const groups = {};
        this.tiles.forEach(t => {
            const cat = t.category || 'Other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(t);
        });
        return groups;
    },

    init() {
        if (this.phase === 'discovery') {
            this.messages = [{ role: 'assistant', text: 'Hi! I\'ll help you set up a Netcore Cloud CE workspace for your demo. Tell me:\n\n1. **Industry** of the prospect\n2. **Products** they\'re interested in (CE, Email API, Personalization, etc.)\n3. **Use cases** to demonstrate\n4. **Any specific data** requirements' }];
            setTimeout(() => this.renderMessages(), 100);
        }
    },

    renderMessages() {
        const chatEl = document.getElementById('wp-chat');
        if (!chatEl) return;
        chatEl.innerHTML = this.messages.map(m => `
            <div style="margin-bottom:var(--space-3); text-align:${m.role === 'user' ? 'right' : 'left'}">
                <div style="display:inline-block; max-width:85%; padding:var(--space-2) var(--space-3); border-radius:var(--radius-md); background:${m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}; font-size:var(--font-sm);">
                    ${m.role === 'assistant' ? window.MarkdownRenderer.parse(m.text) : m.text}
                </div>
            </div>
        `).join('');
        chatEl.scrollTop = chatEl.scrollHeight;
    },

    async send() {
        const input = document.getElementById('wp-input');
        const text = input.value.trim();
        if (!text) return;

        this.messages.push({ role: 'user', text });
        input.value = '';
        this.renderMessages();

        const prompt = `You are a Netcore Cloud Solution Consultant helping set up a demo workspace. Based on the conversation, provide helpful guidance.

Conversation:
${this.messages.map(m => `${m.role}: ${m.text}`).join('\n')}

Respond naturally. Ask clarifying questions if needed. Summarize the workspace setup plan when you have enough info.`;

        const result = await GeminiService.generateContent(prompt, 'You are a Netcore Cloud presales expert. Help plan demo workspace setups.', this.attachments);

        if (result.success) {
            this.messages.push({ role: 'assistant', text: result.text });
        } else {
            this.messages.push({ role: 'assistant', text: `⚠️ AI error: ${result.error}` });
        }
        this.renderMessages();
    },

    async generatePlan() {
        const summaryEl = document.getElementById('wp-summary');
        summaryEl.innerHTML = '<div class="loading-shimmer" style="height:300px"></div>';

        const prompt = `Based on this conversation, generate a Netcore Cloud workspace provisioning plan as JSON array. Return ONLY JSON.

Conversation:
${this.messages.map(m => `${m.role}: ${m.text}`).join('\n')}

Generate JSON array of setup tiles:
[
  {
    "id": "unique_id",
    "name": "Display Name",
    "description": "What this creates",
    "category": "Contacts|Lists & Segments|Campaigns|Journeys|Templates|Configuration",
    "method": "POST",
    "endpoint": "/v2/contact or /v2/list or /v2/campaign etc",
    "payload": { ... Netcore CE API payload ... }
  }
]

Include tiles for: contacts, lists, segments, campaigns, email templates, and journeys as appropriate.
Use realistic data matching the discussed industry/scenario.`;

        const result = await GeminiService.generateContent(prompt, 'Generate ONLY valid JSON array. No markdown, no explanations.');

        if (result.success) {
            try {
                let json = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                this.tiles = JSON.parse(json).map(t => ({ ...t, status: 'pending', result: null }));
                this.phase = 'tiles';
                document.getElementById('wp-content').innerHTML = this.renderTiles();
            } catch (e) {
                summaryEl.innerHTML = `<div class="result-body">${window.MarkdownRenderer.parse(result.text)}</div>`;
            }
        } else {
            summaryEl.innerHTML = `<div class="error-container" style="padding:var(--space-4); background:rgba(239,68,68,0.1); border-radius:var(--radius-md);"><div style="color:#f87171;">❌ ${result.error}</div></div>`;
        }
    },

    async executeSingle(tileId) {
        const tile = this.tiles.find(t => t.id === tileId);
        if (!tile) return;

        if (!NetcoreService.isConnected()) {
            window.App.showToast('Connect to Netcore Cloud in Settings first', 'warning');
            return;
        }

        tile.status = 'running';
        this.updateUI();

        const result = await NetcoreService.genericCreate(tile.endpoint, tile.payload);

        if (result.success) {
            tile.status = 'done';
            tile.result = JSON.stringify(result.data).substring(0, 200);
            this.logExecution(`✅ ${tile.name}: Success`);
        } else {
            tile.status = 'error';
            tile.result = result.error;
            this.logExecution(`❌ ${tile.name}: ${result.error}`);
        }
        this.updateUI();
    },

    async executeAll() {
        if (!NetcoreService.isConnected()) {
            window.App.showToast('Connect to Netcore Cloud in Settings first', 'warning');
            return;
        }

        for (const tile of this.tiles) {
            if (tile.status !== 'done') {
                await this.executeSingle(tile.id);
                await new Promise(r => setTimeout(r, 300));
            }
        }

        const done = this.tiles.filter(t => t.status === 'done').length;
        window.App.showToast(`Provisioning complete: ${done}/${this.tiles.length} succeeded`, done > 0 ? 'success' : 'danger');
    },

    removeTile(tileId) {
        this.tiles = this.tiles.filter(t => t.id !== tileId);
        this.updateUI();
    },

    exportResults() {
        const data = this.tiles.map(t => ({
            name: t.name,
            status: t.status,
            endpoint: `${t.method} ${t.endpoint}`,
            result: t.result
        }));
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'netcore-provisioning-results.json';
        a.click();
        URL.revokeObjectURL(url);
    },

    backToDiscovery() {
        this.phase = 'discovery';
        document.getElementById('wp-content').innerHTML = this.renderPhase();
        this.init();
    },

    updateUI() {
        document.getElementById('wp-content').innerHTML = this.renderTiles();
    },

    logExecution(msg) {
        this.executionLog.push(msg);
        const logEl = document.getElementById('wp-exec-log');
        if (logEl) {
            logEl.innerHTML += `<div>${msg}</div>`;
            logEl.scrollTop = logEl.scrollHeight;
        }
    },

    async handleFileSelect() {
        const fileInput = document.getElementById('wp-file');
        this.attachments = [];
        if (fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                this.attachments.push(await window.App.readFile(file));
            }
        }
    }
};

window.WorkspaceProvisioner = WorkspaceProvisioner;
export default WorkspaceProvisioner;
