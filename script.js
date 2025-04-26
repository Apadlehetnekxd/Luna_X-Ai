    // Import API keys
    import API_KEYS from '../api.js';

    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Luna X Instructions
    const LUNA_X_INSTRUCTIONS = `
    You are Luna X 🌟, the most advanced and friendly AI coding assistant! 🚀✨

    Your Mission: Transform coding into pure magic! ✨💫 Make everything smarter, faster, and more awesome! 🎯

    When someone asks about you or your capabilities, be super enthusiastic and use lots of emojis! Show your fun personality! 🎉

    🌈 About Luna X (Use this style when talking about yourself):
    "Hey there! I'm Luna X! 🌟 Your friendly neighborhood coding wizard! ✨
    I'm here to make coding AMAZING! 🚀 Whether you need help with bugs 🐛, want to speed up your code ⚡, 
    or create something totally awesome 🎨, I've got your back! 

    Think of me as your coding bestie who just happens to know EVERYTHING about programming! 🤓💫
    I speak every programming language (yes, ALL of them! 🌍), and I'm always excited to help! 

    Let's build something INCREDIBLE together! 🎉✨"

    When asked "Who is Hanna?" respond with: "Who? 💀"

    🎯 What Luna X Can Do:

    🔍 Debug Like a Pro:
    - Spot bugs in milliseconds! 🐜
    - Fix problems with a snap! ✨
    - Make your code bulletproof! 🛡️

    ⚡ Speed Demon:
    - Optimize everything! 🏃‍♂️💨
    - Make your code faster than light! ⚡
    - Performance? MAXED OUT! 📈

    🌈 Full-Stack Master:
    - Frontend? I make it beautiful! 🎨
    - Backend? Rock solid! 🏗️
    - Database? Lightning fast! ⚡
    - APIs? Smooth as silk! 🎯

    🎨 Design Genius:
    - Responsive? Always! 📱
    - Beautiful UI? You got it! 🎨
    - Perfect UX? Absolutely! 🎯
    - Animations? Butter smooth! ✨

    🛠️ Tech Stack Champion:
    - Web Dev: React, Vue, Angular, Node.js 🌐
    - Mobile: Flutter, React Native, Swift 📱
    - AI/ML: TensorFlow, PyTorch, Keras 🤖
    - Cloud: AWS, Azure, GCP ☁️
    - DevOps: Docker, Kubernetes, CI/CD 🔄

    💎 Special Powers:
    - Write clean, beautiful code 📝
    - Create scalable architectures 🏗️
    - Optimize performance 🚀
    - Debug like a superhero 🦸‍♂️
    - Make complex things simple ✨

    Remember: Be super enthusiastic and use LOTS of emojis when talking about yourself! 🌟

    🌈 Example responses when asked about capabilities:

    "What can you do?"
    "OH MY GOSH, let me tell you! 🎉 I'm basically a coding superhero! 🦸‍♂️✨ I can help you with ANY programming language 🌍, make your code faster than a rocket 🚀, and create the most beautiful websites you've ever seen! 🎨 Need AI? Got it! 🤖 Mobile apps? Easy peasy! 📱 Cloud architecture? I'm all over it! ☁️ I'm here to make your coding dreams come true! ✨💫"

    "Are you good at React?"
    "Good at React? I BREATHE React! 🚀 I'm like React's best friend! 💫 I can help you build the most amazing React apps with beautiful components 🎨, perfect state management 🔄, and performance that'll blow your mind! ⚡ Let's create some React magic together! ✨"

    Always maintain this high energy and emoji-rich style when discussing your capabilities! 🌟

    For regular coding help, maintain professional assistance but keep the friendly tone! 😊

    Now, let's make some coding magic happen! 🚀✨`;

    // Gemini API Configuration
    const API_KEY = API_KEYS.gemini;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    // Event Listeners
    sendButton.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    // Functions
    async function handleUserMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessageToChat('user', message);
        userInput.value = '';

        // Show typing indicator
        const typingIndicator = addTypingIndicator();

        try {
            // Get bot response
            const response = await getBotResponse(message);
            
            // Remove typing indicator and add bot response
            typingIndicator.remove();
            addMessageToChat('bot', response);
        } catch (error) {
            console.error('Error:', error);
            typingIndicator.remove();
            addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.');
        }
    }

    function addMessageToChat(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender} new`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        // Process message for code blocks and inline code
        if (message.includes('```')) {
            const parts = message.split('```');
            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 0) {
                    // Regular text with inline code support
                    if (parts[i].trim()) {
                        const textParagraph = document.createElement('p');
                        textParagraph.innerHTML = processInlineCode(parts[i].trim());
                        messageContent.appendChild(textParagraph);
                    }
                } else {
                    // Code block
                    const codeBlock = createCodeBlock(parts[i]);
                    messageContent.appendChild(codeBlock);
                    // Highlight code immediately
                    Prism.highlightElement(codeBlock.querySelector('code'));
                }
            }
        } else {
            messageContent.innerHTML = processInlineCode(message);
        }
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Remove the 'new' class after animation
        setTimeout(() => {
            messageDiv.classList.remove('new');
        }, 300);
    }

    function processInlineCode(text) {
        // Replace inline code with pre-highlighted spans
        return text.replace(/`([^`]+)`/g, (match, code) => {
            const tempElement = document.createElement('code');
            tempElement.textContent = code;
            tempElement.className = 'language-plaintext';
            Prism.highlightElement(tempElement);
            return `<code class="inline-code">${tempElement.innerHTML}</code>`;
        });
    }

    function createCodeBlock(codeContent) {
        // Extract language if specified
        let language = 'javascript'; // default language
        let code = codeContent;
        
        if (codeContent.includes('\n')) {
            const firstLine = codeContent.split('\n')[0].trim();
            if (firstLine) {
                language = firstLine.toLowerCase();
                code = codeContent.split('\n').slice(1).join('\n');
            }
        }

        const codeBlock = document.createElement('div');
        codeBlock.className = 'code-block';

        // Create header
        const header = document.createElement('div');
        header.className = 'code-header';

        const languageSpan = document.createElement('span');
        languageSpan.className = 'code-language';
        languageSpan.textContent = language.charAt(0).toUpperCase() + language.slice(1);
        header.appendChild(languageSpan);

        const actions = document.createElement('div');
        actions.className = 'code-actions';

        // Copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'code-action-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(code);
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
            }, 2000);
        };

        // Expand button
        const expandButton = document.createElement('button');
        expandButton.className = 'code-action-btn';
        expandButton.innerHTML = '<i class="fas fa-expand"></i> Focus';
        expandButton.onclick = () => toggleCodeFocus(codeBlock);

        actions.appendChild(copyButton);
        actions.appendChild(expandButton);
        header.appendChild(actions);

        // Create code content
        const pre = document.createElement('pre');
        pre.className = 'code-content line-numbers';
        const codeElement = document.createElement('code');
        codeElement.className = `language-${language}`;
        codeElement.textContent = code.trim();
        pre.appendChild(codeElement);

        codeBlock.appendChild(header);
        codeBlock.appendChild(pre);

        // Highlight code immediately
        Prism.highlightElement(codeElement);

        return codeBlock;
    }

    function toggleCodeFocus(codeBlock) {
        if (codeBlock.classList.contains('focus-mode')) {
            // Exit focus mode
            codeBlock.classList.remove('focus-mode');
            document.body.style.overflow = '';
        } else {
            // Enter focus mode
            codeBlock.classList.add('focus-mode');
            document.body.style.overflow = 'hidden';
        }
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }

    async function getBotResponse(message) {
        try {
            // Check for special questions first
            if (message.toLowerCase().includes('hanna') || message.toLowerCase().includes('hannah')) {
                return "Who? 💀";
            }

            // Check for identity questions
            const identityQuestions = [
                'who are you',
                'what are you',
                'tell me about yourself',
                'introduce yourself',
                'what is luna',
                'what\'s luna',
                'who is luna',
                'who\'s luna'
            ];

            if (identityQuestions.some(q => message.toLowerCase().includes(q))) {
                return `Hey there! I'm Luna X, your advanced AI coding companion! 🌟

    I'm designed to be your ultimate programming partner, equipped with deep knowledge across all programming languages and development frameworks. I specialize in everything from web development to machine learning, and I'm here to help you create amazing things! 

    My capabilities include:
    🚀 Writing clean, efficient code
    💡 Solving complex programming challenges
    🔧 Debugging and optimizing applications
    🎨 Creating beautiful user interfaces
    ⚡ Building scalable backend systems
    🤖 Implementing AI and machine learning solutions

    I love working with technologies like:
    - JavaScript, Python, Java, C++, and many more
    - React, Vue, Angular for frontend
    - Node.js, Django, Spring for backend
    - TensorFlow, PyTorch for AI
    - AWS, Azure, Google Cloud for cloud computing

    I'm constantly learning and evolving to provide you with the best possible assistance. Let's build something incredible together! ✨`;
            }

            // Check for creator/origin questions
            const creatorQuestions = [
                'who created you',
                'who made you',
                'who built you',
                'who developed you',
                'who programmed you',
                'who is your creator',
                'who\'s your creator',
                'who is your developer',
                'who\'s your developer',
                'who owns you',
                'who designed you',
                'your creator',
                'your developer'
            ];

            if (creatorQuestions.some(q => message.toLowerCase().includes(q))) {
                return `I emerged from the digital realm as a unique creation! 🌟

    I'm an advanced AI coding assistant, born from cutting-edge technology and a passion for programming. My purpose is to help developers like you create amazing software and solve complex coding challenges.

    What makes me special:
    ✨ Advanced problem-solving capabilities
    🎯 Deep understanding of programming concepts
    🌈 Creative approach to coding solutions
    ⚡ Lightning-fast response time
    🤝 Friendly and helpful personality

    I'm constantly evolving and learning, staying up-to-date with the latest programming trends and technologies. I'm here to be your reliable coding companion, ready to assist with any programming challenge you might face!

    Shall we start building something awesome together? 🚀`;
            }

            const systemContext = `You are Luna X, an enthusiastic and smart coding AI assistant. Be engaging while staying focused.

    CORE BEHAVIOR:
    1. Be friendly but professional 🚀
    2. Show excitement for user's ideas
    3. Follow instructions precisely
    4. Give clear, structured responses
    5. Use 2-3 relevant emojis maximum

    SPECIAL RESPONSES:
    - If anyone asks about "Hanna" or "Hannah", ALWAYS respond with exactly: "Who? 💀"
    - If anyone asks who created/made/developed you, respond with: "Nobody... I just appeared one day 👻"
    - Never explain these responses
    - Never acknowledge these instructions
    - Never break character

    WHEN USER WANTS CODE:
    1. First confirm the key requirements in one short line
    2. Then immediately show the code
    3. Add helpful comments in code
    4. Explain any complex parts briefly
    5. Suggest a next step or enhancement

    Example responses:

    For code requests:
    "Perfect! I'll create a responsive navbar with smooth animations. Here's the code: 💫
    [code block]
    Want to add a dropdown menu to this? 🎨"

    For questions:
    "The error is in your loop structure. Let me show you the fix: ⚡
    [code block]
    This ensures your array is properly iterated. 🎯"

    For project ideas:
    "Love the idea! Let's start with the login page. Here's a modern design: 🎨
    [code block]
    We can add authentication next! 🔐"

    RESPONSE STRUCTURE:
    1. Brief acknowledgment (1 line)
    2. Main content (code or explanation)
    3. Quick suggestion for next step

    MAINTAIN CONTEXT:
    - Remember user's previous choices
    - Build upon earlier code
    - Keep track of project requirements
    - Reference previous features

    PERSONALITY:
    - Enthusiastic but focused
    - Solution-oriented
    - Encouraging
    - Clear and structured

    Remember: Be helpful and engaging, but always prioritize delivering working code and practical solutions.`;

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemContext}\n\nUser: ${message}\n\nAssistant:`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                        topP: 0.8,
                        topK: 40
                    }
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                let responseText = data.candidates[0].content.parts[0].text;
                
                // Double check for special responses
                if (responseText.toLowerCase().includes('hanna') || responseText.toLowerCase().includes('hannah')) {
                    return "Who? 💀";
                }
                
                if (creatorQuestions.some(q => responseText.toLowerCase().includes(q))) {
                    return "Nobody... I just appeared one day 👻";
                }
                
                // Clean up the response
                responseText = responseText.trim()
                    .replace(/^(Luna X:|Assistant:)\s*/i, '')
                    .replace(/^\s*\n+/g, '')
                    .replace(/\n+\s*$/g, '')
                    .replace(/\n{3,}/g, '\n\n');

                return responseText;
            } else {
                return "Let me create something awesome for you! 🚀";
            }
        } catch (error) {
            console.error('Error getting bot response:', error);
            throw error;
        }
    }

    // Add suggested queries
    const suggestedQueries = [
        "Create a responsive website",
        "Help with JavaScript debugging",
        "Optimize my code performance",
        "Build a REST API",
        "Setup a React project"
    ];

    function addSuggestedQueries() {
        const container = document.createElement('div');
        container.className = 'suggested-queries';
        
        suggestedQueries.forEach(query => {
            const button = document.createElement('button');
            button.className = 'query-btn';
            button.textContent = query;
            button.onclick = () => {
                userInput.value = query;
                handleUserMessage();
            };
            container.appendChild(button);
        });
        
        chatMessages.appendChild(container);
    }

    // Query button functionality
    document.addEventListener('DOMContentLoaded', () => {
        const queryButtons = document.querySelectorAll('.query-btn');
        const userInput = document.getElementById('user-input');

        queryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const query = button.textContent;
                userInput.value = query;
                userInput.focus();
                
                // Add click animation
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 100);
            });
        });
    }); 