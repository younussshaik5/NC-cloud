// ========================================
// Netcore Cloud CE API Service
// ========================================

const NetcoreService = {
    apiKey: null,
    emailApiKey: null,
    panelUrl: null,

    init() {
        this.apiKey = localStorage.getItem('nc_api_key') || null;
        this.emailApiKey = localStorage.getItem('nc_email_api_key') || null;
        this.panelUrl = localStorage.getItem('nc_panel_url') || null;
    },

    setCredentials(apiKey, emailApiKey, panelUrl) {
        this.apiKey = apiKey;
        this.emailApiKey = emailApiKey;
        this.panelUrl = panelUrl ? panelUrl.replace(/\/$/, '') : null;
        localStorage.setItem('nc_api_key', this.apiKey);
        if (emailApiKey) localStorage.setItem('nc_email_api_key', this.emailApiKey);
        if (panelUrl) localStorage.setItem('nc_panel_url', this.panelUrl);
    },

    clearCredentials() {
        this.apiKey = null;
        this.emailApiKey = null;
        this.panelUrl = null;
        localStorage.removeItem('nc_api_key');
        localStorage.removeItem('nc_email_api_key');
        localStorage.removeItem('nc_panel_url');
    },

    isConnected() {
        return !!(this.apiKey);
    },

    getApiKey() {
        return this.apiKey;
    },

    getEmailApiKey() {
        return this.emailApiKey;
    },

    getPanelUrl() {
        return this.panelUrl;
    },

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'api_key': this.apiKey
        };
    },

    getEmailHeaders() {
        return {
            'Content-Type': 'application/json',
            'api_key': this.emailApiKey || this.apiKey
        };
    },

    async request(baseUrl, endpoint, method = 'GET', body = null) {
        if (!this.isConnected()) {
            return { success: false, error: 'Not connected. Configure Netcore Cloud credentials in Settings.' };
        }

        const targetUrl = `${baseUrl}${endpoint}`;
        const headers = this.getHeaders();

        // 1. Try Proxy Server (to bypass CORS)
        try {
            const proxyUrl = window.APP_CONFIG?.PROXY_URL || 'http://localhost:3000/api/proxy';
            const proxyResponse = await fetch(proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: targetUrl,
                    method,
                    headers,
                    body
                })
            });

            if (proxyResponse.ok) {
                const data = await proxyResponse.json();
                return { success: true, data };
            } else {
                console.warn('[Proxy] Failed, falling back to direct call.', proxyResponse.status);
            }
        } catch (e) {
            console.warn('[Proxy] Unreachable, falling back to direct call.', e.message);
        }

        // 2. Fallback: Direct Call
        try {
            const options = { method, headers };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(targetUrl, options);
            if (!response.ok) {
                const errorText = await response.text().catch(() => '');
                throw new Error(`API error: ${response.status} ${response.statusText}${errorText ? ' — ' + errorText : ''}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Netcore API Error:', error);
            return { success: false, error: error.message + ' (Check CORS or Proxy Server)' };
        }
    },

    // ---- CE API (Customer Engagement) ----
    CE_BASE: 'https://api.netcorecloud.net',

    async ceRequest(endpoint, method = 'GET', body = null) {
        return this.request(this.CE_BASE, endpoint, method, body);
    },

    // ---- Contact Operations ----
    async addContact(contact) {
        return this.ceRequest('/v2/contact', 'POST', contact);
    },

    async getContact(identifier) {
        return this.ceRequest(`/v2/contact?email=${encodeURIComponent(identifier)}`);
    },

    async updateContact(contact) {
        return this.ceRequest('/v2/contact', 'PUT', contact);
    },

    async deleteContact(email) {
        return this.ceRequest('/v2/contact', 'DELETE', { email });
    },

    async bulkAddContacts(contacts) {
        return this.ceRequest('/v2/contact/bulk', 'POST', { contacts });
    },

    // ---- List / Segment Operations ----
    async getLists() {
        return this.ceRequest('/v2/list');
    },

    async createList(listData) {
        return this.ceRequest('/v2/list', 'POST', listData);
    },

    async addContactToList(listId, contacts) {
        return this.ceRequest(`/v2/list/${listId}/contact`, 'POST', { contacts });
    },

    // ---- Campaign Operations ----
    async getCampaigns() {
        return this.ceRequest('/v2/campaign');
    },

    async createCampaign(campaign) {
        return this.ceRequest('/v2/campaign', 'POST', campaign);
    },

    async getCampaignStats(campaignId) {
        return this.ceRequest(`/v2/campaign/${campaignId}/stats`);
    },

    // ---- Event Tracking ----
    async trackEvent(eventData) {
        return this.ceRequest('/v2/event', 'POST', eventData);
    },

    async getEvents(contactId) {
        return this.ceRequest(`/v2/event?contact_id=${contactId}`);
    },

    // ---- Email API ----
    EMAIL_BASE: 'https://emailapi.netcorecloud.net',

    async sendEmail(emailData) {
        return this.request(this.EMAIL_BASE, '/v5/mail/send', 'POST', emailData);
    },

    async getEmailStats(params = '') {
        return this.request(this.EMAIL_BASE, `/v5/stats?${params}`);
    },

    // ---- Journey Operations ----
    async getJourneys() {
        return this.ceRequest('/v2/journey');
    },

    async createJourney(journeyData) {
        return this.ceRequest('/v2/journey', 'POST', journeyData);
    },

    // ---- Push Notification ----
    async sendPushNotification(pushData) {
        return this.ceRequest('/v2/push', 'POST', pushData);
    },

    // ---- SMS ----
    async sendSMS(smsData) {
        return this.ceRequest('/v2/sms', 'POST', smsData);
    },

    // ---- WhatsApp ----
    async sendWhatsApp(waData) {
        return this.ceRequest('/v2/whatsapp', 'POST', waData);
    },

    // ---- Generic CRUD (used by Workspace Provisioner) ----
    async genericCreate(endpoint, data) {
        return this.ceRequest(endpoint, 'POST', data);
    },

    async genericGet(endpoint) {
        return this.ceRequest(endpoint, 'GET');
    },

    async genericUpdate(endpoint, data) {
        return this.ceRequest(endpoint, 'PUT', data);
    },

    // ---- Test Connection ----
    async testConnection() {
        try {
            const result = await this.ceRequest('/v2/list');
            return result.success;
        } catch {
            return false;
        }
    }
};

NetcoreService.init();

export default NetcoreService;
