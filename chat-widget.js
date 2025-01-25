(function() {
    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
        }

        .n8n-chat-widget .close-button:hover {
            color: #333;
        }

        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
            object-fit: contain;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: #333;
        }

        .n8n-chat-widget .chat-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .n8n-chat-widget .welcome-screen {
            padding: 20px;
            text-align: center;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .chat-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px;
            padding: 0 20px;
        }

        .n8n-chat-widget .chat-button {
            padding: 16px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: transform 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .n8n-chat-widget .chat-button:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .lead-form {
            padding: 20px;
            display: none;
        }

        .n8n-chat-widget .lead-form.active {
            display: block;
        }

        .n8n-chat-widget .form-field {
            margin-bottom: 16px;
        }

        .n8n-chat-widget .form-field label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #333;
        }

        .n8n-chat-widget .form-field input {
            width: 100%;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s;
        }

        .n8n-chat-widget .form-field input:focus {
            outline: none;
            border-color: var(--chat--color-primary);
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            margin-left: auto;
        }

        .n8n-chat-widget .chat-message.bot {
            background: white;
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: #333;
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: white;
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            resize: none;
            font-family: inherit;
            font-size: 14px;
            min-height: 24px;
            max-height: 120px;
        }

        .n8n-chat-widget .chat-input button {
            padding: 12px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: transform 0.2s;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: white;
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }
    `;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    class N8nChat {
        constructor(config) {
            this.config = this.mergeConfig(config);
            this.currentSessionId = '';
            this.currentWebhook = null;
            this.leadData = null;
            this.initialize();
        }

        mergeConfig(userConfig) {
            const defaultConfig = {
                webhooks: [],
                branding: {
                    logo: '',
                    name: 'Chat Support',
                    welcomeText: 'Hi 👋 How can we help?',
                    responseTimeText: 'We typically respond right away',
                    poweredBy: {
                        text: 'Powered by n8n',
                        link: 'https://n8n.io'
                    }
                },
                style: {
                    primaryColor: '#854fff',
                    secondaryColor: '#6b3fd4',
                    position: 'right'
                },
                leadCollection: {
                    enabled: false,
                    fields: []
                }
            };

            return {
                webhooks: userConfig.webhooks || defaultConfig.webhooks,
                branding: { ...defaultConfig.branding, ...userConfig.branding },
                style: { ...defaultConfig.style, ...userConfig.style },
                leadCollection: { ...defaultConfig.leadCollection, ...userConfig.leadCollection }
            };
        }

        initialize() {
            this.createWidget();
            this.attachEventListeners();
        }

        createWidget() {
            const widget = document.createElement('div');
            widget.className = 'n8n-chat-widget';
            
            widget.style.setProperty('--n8n-chat-primary-color', this.config.style.primaryColor);
            widget.style.setProperty('--n8n-chat-secondary-color', this.config.style.secondaryColor);

            const chatContainer = document.createElement('div');
            chatContainer.className = `chat-container${this.config.style.position === 'left' ? ' position-left' : ''}`;
            
            // Create welcome screen with chat buttons
            const welcomeScreen = document.createElement('div');
            welcomeScreen.className = 'welcome-screen';
            welcomeScreen.innerHTML = `
                <h2 class="welcome-text">${this.config.branding.welcomeText}</h2>
                <div class="chat-buttons">
                    ${this.config.webhooks.map(webhook => `
                        <button class="chat-button" data-webhook-id="${webhook.id}">
                            ${webhook.icon} ${webhook.name}
                        </button>
                    `).join('')}
                </div>
                <p class="response-text">${this.config.branding.responseTimeText}</p>
            `;

            // Create lead form if enabled
            const leadForm = document.createElement('div');
            leadForm.className = 'lead-form';
            if (this.config.leadCollection.enabled) {
                leadForm.innerHTML = `
                    <form id="leadForm">
                        ${this.config.leadCollection.fields.map(field => `
                            <div class="form-field">
                                <label for="${field.name}">${field.label}</label>
                                <input 
                                    type="${field.type || 'text'}"
                                    id="${field.name}"
                                    name="${field.name}"
                                    ${field.required ? 'required' : ''}
                                    placeholder="${field.placeholder || ''}"
                                >
                            </div>
                        `).join('')}
                        <button type="submit" class="chat-button">Start Chat</button>
                    </form>
                `;
            }

            // Create chat interface
            const chatInterface = document.createElement('div');
            chatInterface.className = 'chat-interface';
            chatInterface.innerHTML = `
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <textarea placeholder="Type your message..." rows="1"></textarea>
                    <button type="submit">Send</button>
                </div>
            `;

            // Create toggle button
            const toggleButton = document.createElement('button');
            toggleButton.className = `chat-toggle${this.config.style.position === 'left' ? ' position-left' : ''}`;
            toggleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                </svg>
            `;

            // Assemble widget
            chatContainer.appendChild(welcomeScreen);
            chatContainer.appendChild(leadForm);
            chatContainer.appendChild(chatInterface);
            
            widget.appendChild(chatContainer);
            widget.appendChild(toggleButton);
            document.body.appendChild(widget);
            this.widget = widget;
        }

        attachEventListeners() {
            // Toggle chat window
            this.widget.querySelector('.chat-toggle').addEventListener('click', () => {
                this.widget.querySelector('.chat-container').classList.toggle('open');
            });

            // Close button
            const closeButton = this.widget.querySelector('.close-button');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    this.widget.querySelector('.chat-container').classList.remove('open');
                });
            }

            // Chat buttons
            this.widget.querySelectorAll('.chat-button').forEach(button => {
                button.addEventListener('click', () => {
                    const webhookId = button.dataset.webhookId;
                    this.handleWebhookSelection(webhookId);
                });
            });

            // Lead form submission
            if (this.config.leadCollection.enabled) {
                const form = this.widget.querySelector('#leadForm');
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.handleLeadSubmission(new FormData(form));
                    });
                }
            }

            // Send message
            const sendButton = this.widget.querySelector('.chat-input button');
            const textarea = this.widget.querySelector('.chat-input textarea');

            if (sendButton && textarea) {
                sendButton.addEventListener('click', () => {
                    const message = textarea.value.trim();
                    if (message) {
                        this.sendMessage(message);
                        textarea.value = '';
                        textarea.style.height = 'auto';
                    }
                });

                textarea.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const message = textarea.value.trim();
                        if (message) {
                            this.sendMessage(message);
                            textarea.value = '';
                            textarea.style.height = 'auto';
                        }
                    }
                });

                // Auto-resize textarea
                textarea.addEventListener('input', () => {
                    textarea.style.height = 'auto';
                    textarea.style.height = textarea.scrollHeight + 'px';
                });
            }
        }

        async handleWebhookSelection(webhookId) {
            this.currentWebhook = this.config.webhooks.find(w => w.id === webhookId);
            
            if (this.config.leadCollection.enabled) {
                this.showLeadForm();
            } else {
                await this.startChat();
            }
        }

        showLeadForm() {
            this.widget.querySelector('.welcome-screen').style.display = 'none';
            this.widget.querySelector('.lead-form').classList.add('active');
        }

        async handleLeadSubmission(formData) {
            this.leadData = Object.fromEntries(formData.entries());
            await this.startChat();
        }

        async startChat() {
            if (!this.currentWebhook) return;

            this.currentSessionId = crypto.randomUUID();
            const data = {
                action: "loadPreviousSession",
                sessionId: this.currentSessionId,
                route: this.currentWebhook.route,
                metadata: {
                    leadData: this.leadData
                }
            };

            try {
                const response = await this.sendWebhookRequest(this.currentWebhook.url, data);
                this.showChatInterface(response);
            } catch (error) {
                console.error('Error starting chat:', error);
                this.showError('Failed to start chat. Please try again.');
            }
        }

        async sendMessage(message) {
            if (!message.trim()) return;

            const messagesContainer = this.widget.querySelector('.chat-messages');
            const userMessageElement = document.createElement('div');
            userMessageElement.className = 'chat-message user';
            userMessageElement.textContent = message;
            messagesContainer.appendChild(userMessageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            const data = {
                action: "sendMessage",
                sessionId: this.currentSessionId,
                route: this.currentWebhook.route,
                chatInput: message,
                metadata: {
                    leadData: this.leadData
                }
            };

            try {
                const response = await this.sendWebhookRequest(this.currentWebhook.url, data);
                const botResponse = response.output || (Array.isArray(response) ? response[0].output : '');
                
                const botMessageElement = document.createElement('div');
                botMessageElement.className = 'chat-message bot';
                botMessageElement.textContent = botResponse;
                messagesContainer.appendChild(botMessageElement);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                console.error('Error sending message:', error);
                this.showError('Failed to send message. Please try again.');
            }
        }

        async sendWebhookRequest(url, data) {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json();
        }

        showChatInterface(response) {
            this.widget.querySelector('.welcome-screen').style.display = 'none';
            this.widget.querySelector('.lead-form').classList.remove('active');
            
            const chatInterface = this.widget.querySelector('.chat-interface');
            chatInterface.classList.add('active');

            if (response && (response.output || (Array.isArray(response) && response[0].output))) {
                const botMessageElement = document.createElement('div');
                botMessageElement.className = 'chat-message bot';
                botMessageElement.textContent = response.output || response[0].output;
                this.widget.querySelector('.chat-messages').appendChild(botMessageElement);
            }
        }

        showError(message) {
            console.error(message);
            // Add error message to chat if needed
            const errorElement = document.createElement('div');
            errorElement.className = 'chat-message bot error';
            errorElement.textContent = message;
            this.widget.querySelector('.chat-messages').appendChild(errorElement);
        }
    }

    // Initialize the chat widget if config is available
    if (window.ChatWidgetConfig) {
        window.n8nChat = new N8nChat(window.ChatWidgetConfig);
    }
})();
