(function() {
    // Keep existing styles from the original widget...
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        /* ... [previous styles remain the same] ... */

        /* New styles for lead collection form */
        .n8n-chat-widget .lead-form {
            padding: 20px;
            background: #ffffff;
        }

        .n8n-chat-widget .lead-form input {
            width: 100%;
            padding: 12px;
            margin-bottom: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            font-family: inherit;
            font-size: 14px;
        }

        .n8n-chat-widget .chat-options {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            padding: 20px;
        }

        .n8n-chat-widget .chat-option-btn {
            flex: 1 1 calc(50% - 6px);
            padding: 16px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: transform 0.2s;
        }

        .n8n-chat-widget .chat-option-btn:hover {
            transform: scale(1.02);
        }
    `;

    // Default configuration with support for multiple webhooks
    const defaultConfig = {
        webhooks: [
            {
                id: 'general',
                name: 'General Chat',
                url: '',
                route: 'general',
                icon: '💬'
            }
            // Add more webhook configurations as needed
        ],
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Powered by n8n',
                link: 'https://n8n.partnerlinks.io/m8a94i19zhqq?utm_source=nocodecreative.io'
            }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right'
        },
        leadCollection: {
            enabled: true,
            fields: [
                { name: 'name', label: 'Name', required: true },
                { name: 'email', label: 'Email', required: true },
                { name: 'company', label: 'Company', required: false }
            ],
            webhookUrl: '' // URL for sending lead data
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhooks: Array.isArray(window.ChatWidgetConfig.webhooks) ? 
                window.ChatWidgetConfig.webhooks : defaultConfig.webhooks,
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style },
            leadCollection: { ...defaultConfig.leadCollection, ...window.ChatWidgetConfig.leadCollection }
        } : defaultConfig;

    let currentSessionId = '';
    let currentWebhook = null;
    let leadData = null;

    function createChatOptionsHTML() {
        return `
            <div class="chat-options">
                ${config.webhooks.map(webhook => `
                    <button class="chat-option-btn" data-webhook-id="${webhook.id}">
                        ${webhook.icon} ${webhook.name}
                    </button>
                `).join('')}
            </div>
        `;
    }

    function createLeadFormHTML() {
        if (!config.leadCollection.enabled) return '';
        
        return `
            <div class="lead-form">
                ${config.leadCollection.fields.map(field => `
                    <input 
                        type="${field.name === 'email' ? 'email' : 'text'}"
                        name="${field.name}"
                        placeholder="${field.label}"
                        ${field.required ? 'required' : ''}
                    >
                `).join('')}
                <button class="new-chat-btn submit-lead-btn">Start Chat</button>
            </div>
        `;
    }

    async function submitLeadData() {
        if (!config.leadCollection.enabled) return true;
        
        const formData = {};
        const form = document.querySelector('.lead-form');
        const inputs = form.querySelectorAll('input');
        
        inputs.forEach(input => {
            formData[input.name] = input.value;
        });

        try {
            const response = await fetch(config.leadCollection.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                leadData = formData;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error submitting lead data:', error);
            return false;
        }
    }

    // Modified startNewConversation function to include lead data
    async function startNewConversation(webhookId) {
        if (!await submitLeadData()) {
            alert('Failed to submit contact information. Please try again.');
            return;
        }

        currentWebhook = config.webhooks.find(w => w.id === webhookId);
        if (!currentWebhook) return;

        currentSessionId = crypto.randomUUID();
        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: currentWebhook.route,
            metadata: {
                userId: "",
                leadData: leadData
            }
        }];

        try {
            const response = await fetch(currentWebhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // ... Rest of the conversation handling code ...
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Modified sendMessage function to include lead data
    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: currentWebhook.route,
            chatInput: message,
            metadata: {
                userId: "",
                leadData: leadData
            }
        };

        // ... Rest of the message handling code ...
    }

    // Initialize widget with new options
    function initializeWidget() {
        // ... Previous initialization code ...

        // Add event listeners for chat options
        const chatOptions = document.querySelectorAll('.chat-option-btn');
        chatOptions.forEach(button => {
            button.addEventListener('click', () => {
                const webhookId = button.dataset.webhookId;
                startNewConversation(webhookId);
            });
        });

        // Add event listener for lead form submission
        const submitLeadBtn = document.querySelector('.submit-lead-btn');
        if (submitLeadBtn) {
            submitLeadBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const form = document.querySelector('.lead-form');
                if (form.checkValidity()) {
                    await submitLeadData();
                } else {
                    form.reportValidity();
                }
            });
        }
    }

    // Initialize the widget
    initializeWidget();
})();
