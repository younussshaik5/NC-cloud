const NetcoreKnowledge = {
    // 1. Product Suite
    products: {
        ce: {
            name: 'Customer Engagement (CE)',
            desc: 'AI-powered omnichannel engagement platform for personalized customer journeys',
            channels: ['Email', 'SMS', 'App Push', 'Web Push', 'WhatsApp', 'In-App', 'RCS', 'Web Messages'],
            features: ['Journey Builder', 'Segmentation', 'A/B Testing', 'Analytics', 'Automation']
        },
        emailApi: {
            name: 'Email API',
            desc: 'Lightning-fast RESTful Email API for transactional and marketing emails',
            features: ['SMTP Relay', 'RESTful API', 'SDKs', 'Real-time Tracking', 'Deliverability Monitoring']
        },
        personalization: {
            name: 'Personalization (Raman AI)',
            desc: '1:1 AI-powered personalization across web, app, and channels',
            features: ['Product Recommendations', 'Website Personalization', 'Search Personalization', 'Content Personalization']
        },
        productExperience: {
            name: 'Product Experience',
            desc: 'No-code nudges, walkthroughs, and in-app guidance',
            features: ['Contextual Nudges', 'Walkthroughs', 'Tooltips', 'Surveys', 'Feature Adoption']
        },
        inboxCommerce: {
            name: 'Inbox Commerce (AMP Email)',
            desc: 'Transform emails into interactive shopping experiences',
            features: ['In-Email Cart', 'Product Browse', 'Interactive Forms', 'Live Content']
        },
        coMarketer: {
            name: 'Co-Marketer AI',
            desc: 'Agentic AI system with specialized marketing agents',
            agents: ['Content Agent', 'Insights Agent', 'Segment Agent', 'Merchandiser Agent']
        }
    },

    // 2. SDK Templates
    sdks: {
        web: {
            name: 'Web SDK',
            init: `
// Netcore CE Web SDK Initialization
<script>
    !function(n,e,t,c,o,r,k){n.smartech||(n.smartech=function(){(n.smartech.q=n.smartech.q||[]).push(arguments)});
    var s=e.createElement("script");s.type="text/javascript";s.async=!0;
    s.src="https://cdnt.netcorecloud.net/smartechclient.js";
    var a=e.getElementsByTagName("script")[0];a.parentNode.insertBefore(s,a)
    }(window,document);
    smartech('create', 'YOUR_APP_ID');
    smartech('register', 'YOUR_SITE_URL');
    smartech('identify', 'USER_EMAIL_OR_ID');
</script>`,
            events: `
// Track Custom Events
smartech('dispatch', 'event_name', {
    key1: 'value1',
    key2: 'value2'
});

// Track Page Browse
smartech('dispatch', 'page_browse', {
    page_url: window.location.href,
    page_title: document.title
});

// Track Product View (E-commerce)
smartech('dispatch', 'product_viewed', {
    product_id: 'SKU123',
    product_name: 'Blue T-Shirt',
    price: 29.99,
    category: 'Apparel'
});`,
            push: `
// Web Push Notification Registration
smartech('register', 'YOUR_SITE_URL');

// Request Push Permission
smartech('push', 'requestPermission');

// Custom Push Handling
smartech('push', 'onNotificationClick', function(data) {
    console.log('Push clicked:', data);
});`
        },
        android: {
            name: 'Android SDK',
            init: `
// build.gradle (app level)
dependencies {
    implementation 'com.netcore.android:smartech-sdk:3.+'
    implementation 'com.netcore.android:smartech-push:3.+'
    implementation 'com.netcore.android:smartech-nudges:3.+'
}

// Application class
import com.netcore.android.Smartech;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Smartech.getInstance(new WeakReference<>(this)).initializeSdk(this);
        Smartech.getInstance(new WeakReference<>(this)).setDebugLevel(9);
    }
}`,
            events: `
// Track Events
HashMap<String, Object> payload = new HashMap<>();
payload.put("product_id", "SKU123");
payload.put("price", 29.99);
Smartech.getInstance(new WeakReference<>(context)).trackEvent("product_viewed", payload);

// Identify User
Smartech.getInstance(new WeakReference<>(context)).login("user@email.com");`
        },
        ios: {
            name: 'iOS SDK',
            init: `
// Podfile
pod 'Smartech-iOS-SDK', '~> 3.0'
pod 'SmartPush-iOS-SDK', '~> 3.0'

// AppDelegate.swift
import Smartech
import SmartPush

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    Smartech.sharedInstance().initSDK(with: application, launchOptions: launchOptions)
    Smartech.sharedInstance().setDebugLevel(.verbose)
    SmartPush.sharedInstance().registerForPushNotificationWithDefaultAuthorizationOptions()
    return true
}`,
            events: `
// Track Events
let payload: [String: Any] = [
    "product_id": "SKU123",
    "price": 29.99
]
Smartech.sharedInstance().trackEvent("product_viewed", andPayload: payload)

// Identify User
Smartech.sharedInstance().login("user@email.com")`
        },
        reactNative: {
            name: 'React Native SDK',
            init: `
// Install
npm install smartech-reactnative

// Initialize
import Smartech from 'smartech-reactnative';

// In your App component
useEffect(() => {
    Smartech.login('user@email.com');
}, []);`,
            events: `
// Track Events
Smartech.trackEvent('product_viewed', {
    product_id: 'SKU123',
    price: 29.99
});

// Set User Identity
Smartech.setUserIdentity('user@email.com', (response) => {
    console.log('Identity set:', response);
});`
        }
    },

    // 3. CE API Endpoints Reference
    apiEndpoints: {
        contacts: {
            add: { method: 'POST', path: '/v2/contact', desc: 'Add a new contact' },
            get: { method: 'GET', path: '/v2/contact', desc: 'Get contact by email/phone' },
            update: { method: 'PUT', path: '/v2/contact', desc: 'Update contact attributes' },
            delete: { method: 'DELETE', path: '/v2/contact', desc: 'Delete a contact' },
            bulk: { method: 'POST', path: '/v2/contact/bulk', desc: 'Bulk add contacts' }
        },
        lists: {
            getAll: { method: 'GET', path: '/v2/list', desc: 'Get all lists' },
            create: { method: 'POST', path: '/v2/list', desc: 'Create a new list' },
            addContacts: { method: 'POST', path: '/v2/list/{id}/contact', desc: 'Add contacts to list' }
        },
        campaigns: {
            getAll: { method: 'GET', path: '/v2/campaign', desc: 'Get all campaigns' },
            create: { method: 'POST', path: '/v2/campaign', desc: 'Create a campaign' },
            stats: { method: 'GET', path: '/v2/campaign/{id}/stats', desc: 'Get campaign statistics' }
        },
        events: {
            track: { method: 'POST', path: '/v2/event', desc: 'Track a custom event' },
            get: { method: 'GET', path: '/v2/event', desc: 'Get events for a contact' }
        },
        journeys: {
            getAll: { method: 'GET', path: '/v2/journey', desc: 'Get all journeys' },
            create: { method: 'POST', path: '/v2/journey', desc: 'Create a journey' }
        },
        push: {
            send: { method: 'POST', path: '/v2/push', desc: 'Send push notification' }
        },
        sms: {
            send: { method: 'POST', path: '/v2/sms', desc: 'Send SMS' }
        },
        whatsapp: {
            send: { method: 'POST', path: '/v2/whatsapp', desc: 'Send WhatsApp message' }
        },
        email: {
            send: { method: 'POST', path: '/v5/mail/send', desc: 'Send email via Email API', base: 'https://emailapi.netcorecloud.net' }
        }
    },

    // 4. Journey Templates
    journeyTemplates: {
        onboarding: {
            name: 'User Onboarding',
            steps: ['Welcome Email', 'Day 1: Feature Highlight Push', 'Day 3: In-App Walkthrough', 'Day 7: Engagement Check Email', 'Day 14: Conversion Nudge']
        },
        cartAbandonment: {
            name: 'Cart Abandonment',
            steps: ['Trigger: Cart Abandoned', '30min: Push Notification', '2hr: Email Reminder', '24hr: WhatsApp with Discount', '72hr: Final Email']
        },
        reEngagement: {
            name: 'Re-Engagement',
            steps: ['Trigger: 30 Days Inactive', 'Email: We Miss You', 'Day 3: Push with Offer', 'Day 7: SMS Reminder', 'Day 14: WhatsApp Personalized']
        },
        winback: {
            name: 'Winback Campaign',
            steps: ['Trigger: Churned User', 'Week 1: Email Value Recap', 'Week 2: Push Special Offer', 'Week 3: WhatsApp Personal Touch', 'Week 4: Final Email with Ultimatum']
        },
        postPurchase: {
            name: 'Post-Purchase',
            steps: ['Trigger: Purchase Complete', 'Immediate: Order Confirmation Email', 'Day 1: App Push Rating Request', 'Day 7: Cross-sell Email', 'Day 30: Replenishment Reminder']
        }
    },

    // 5. Industry Verticals
    industries: [
        'E-commerce & Retail', 'BFSI (Banking, Financial Services, Insurance)',
        'Media & Entertainment', 'Travel & Hospitality', 'EdTech',
        'Fantasy Gaming', 'Food & Delivery', 'Health & Wellness'
    ],

    // 6. Competitive Intelligence
    competitors: {
        moengage: {
            name: 'MoEngage',
            strengths: ['Customer analytics', 'AI journey orchestration', 'Strong in APAC'],
            weaknesses: ['Rules-based personalization', 'Slower campaign execution', 'Limited email deliverability focus'],
            netcoreAdvantage: 'Superior omnichannel engagement, advanced AI agents (Co-Marketer), better email deliverability, and 1:1 personalization'
        },
        clevertap: {
            name: 'CleverTap',
            strengths: ['Mobile app analytics', 'Real-time personalization', 'Strong push notifications'],
            weaknesses: ['Complex pricing', 'Less comprehensive email capabilities', 'Steeper learning curve'],
            netcoreAdvantage: 'All-in-one unified platform, superior email infrastructure, no-code Product Experience suite, and Inbox Commerce'
        },
        braze: {
            name: 'Braze',
            strengths: ['Real-time data processing', 'Mobile-first design', 'Enterprise scale'],
            weaknesses: ['Premium pricing', 'Less focus on email deliverability', 'Complex implementation'],
            netcoreAdvantage: 'More economical, broader product suite beyond marketing, superior Email API, and AI-driven personalization'
        },
        iterable: {
            name: 'Iterable',
            strengths: ['Cross-channel lifecycle automation', 'Flexible data model', 'Good API design'],
            weaknesses: ['Limited personalization depth', 'No product experience tools', 'Smaller market presence in APAC'],
            netcoreAdvantage: 'Raman AI for deeper personalization, Product Experience suite (Nudges/Walkthroughs), and stronger APAC presence'
        },
        webengage: {
            name: 'WebEngage',
            strengths: ['Journey designer', 'Good analytics', 'Popular in India'],
            weaknesses: ['Limited AI capabilities', 'No email API offering', 'Basic personalization'],
            netcoreAdvantage: 'Advanced Co-Marketer AI, dedicated Email API, Inbox Commerce, and enterprise-grade scalability'
        },
        insider: {
            name: 'Insider',
            strengths: ['Predictive segmentation', 'Good web personalization', 'Template library'],
            weaknesses: ['Complex onboarding', 'Premium pricing', 'Limited in-app capabilities'],
            netcoreAdvantage: 'Better pricing model, superior Product Experience suite, and unified CDP with all channels'
        }
    },

    // 7. Analysis Prompts
    prompts: {
        analyzeIntegration: `
Analyze the Netcore Cloud integration requirement and return a structured JSON configuration.

Products: CE (Customer Engagement), Email API, Personalization, Product Experience (Nudges/Walkthroughs)
Platforms: Web, Android, iOS, React Native, Flutter

JSON Structure:
{
  "product": "primary_product",
  "platform": "target_platform",
  "sdkModules": ["core", "push", "nudges", "inbox"],
  "channels": ["email", "sms", "push", "whatsapp", "in-app"],
  "events": ["list_of_events_to_track"],
  "integrations": {
    "name": "Third-party Integration Name",
    "type": "webhook|api|sdk",
    "endpoints": ["https://api.example.com/..."]
  },
  "complexity": "low|medium|high",
  "reasoning": "Explain the architectural choices."
}

Requirement:
`
    }
};

export default NetcoreKnowledge;
