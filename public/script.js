// Sample user data
const users = [
    {
        id: 1,
        name: "Alice Johnson",
        avatar: "/api/placeholder/40/40",
        lastMessage: "Hey, how are you doing?",
        time: "10:30 AM",
        unread: 3,
        isOnline: true
    },
    {
        id: 2,
        name: "Bob Smith",
        avatar: "/api/placeholder/40/40",
        lastMessage: "Did you finish the project?",
        time: "Yesterday",
        unread: 0,
        isOnline: false
    },
    {
        id: 3,
        name: "Carol Williams",
        avatar: "/api/placeholder/40/40",
        lastMessage: "Thanks for your help!",
        time: "Yesterday",
        unread: 0,
        isOnline: true
    },
    {
        id: 4,
        name: "Dave Brown",
        avatar: "/api/placeholder/40/40",
        lastMessage: "Let's meet tomorrow",
        time: "Monday",
        unread: 2,
        isOnline: false
    },
    {
        id: 5,
        name: "Eva Martinez",
        avatar: "/api/placeholder/40/40",
        lastMessage: "Call me when you're free",
        time: "Sunday",
        unread: 0,
        isOnline: true
    }
];

// Sample messages data
const chatMessages = {
    1: [
        { sender: "them", text: "Hey, how are you doing?", time: "10:25 AM" },
        { sender: "them", text: "Did you see the new design?", time: "10:26 AM" },
        { sender: "them", text: "I think we need to make some changes.", time: "10:30 AM" }
    ],
    2: [
        { sender: "them", text: "Hi there!", time: "Yesterday" },
        { sender: "me", text: "Hello! How's the project coming along?", time: "Yesterday" },
        { sender: "them", text: "Did you finish the project?", time: "Yesterday" }
    ],
    3: [
        { sender: "me", text: "I've sent you the files.", time: "Yesterday" },
        { sender: "them", text: "Got them, thanks!", time: "Yesterday" },
        { sender: "them", text: "Thanks for your help!", time: "Yesterday" }
    ],
    4: [
        { sender: "them", text: "Are you free tomorrow?", time: "Monday" },
        { sender: "me", text: "Yes, after 2 PM.", time: "Monday" },
        { sender: "them", text: "Let's meet tomorrow", time: "Monday" },
        { sender: "them", text: "At the coffee shop?", time: "Monday" }
    ],
    5: [
        { sender: "me", text: "Did you get my email?", time: "Sunday" },
        { sender: "them", text: "Yes, I'll review it soon.", time: "Sunday" },
        { sender: "them", text: "Call me when you're free", time: "Sunday" }
    ]
};

// Current active chat
let currentChatId = null;

// Function to populate users list
function populateUsersList() {
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = `user-item d-flex align-items-center ${user.id === currentChatId ? 'active' : ''}`;
        userElement.dataset.userId = user.id;
        
        userElement.innerHTML = `
            <div class="user-img me-3">
                <img src="${user.avatar}" alt="${user.name}" class="rounded-circle">
                ${user.isOnline ? '<span class="position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle" style="width: 12px; height: 12px;"></span>' : ''}
            </div>
            <div class="user-info flex-grow-1">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="user-name">${user.name}</div>
                    <div class="message-time">${user.time}</div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="user-last-message">${user.lastMessage}</div>
                    ${user.unread > 0 ? `<div class="unread-count">${user.unread}</div>` : ''}
                </div>
            </div>
        `;
        
        userElement.addEventListener('click', () => {
            selectChat(user.id);
        });
        
        usersList.appendChild(userElement);
    });
}

// Function to show messages for a specific chat
function showMessages(userId) {
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.innerHTML = '';
    
    const messages = chatMessages[userId] || [];
    
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message d-flex flex-column ${message.sender === 'me' ? 'message-sent ms-auto' : 'message-received me-auto'}`;
        
        messageElement.innerHTML = `
            <div class="message-content">${message.text}</div>
            <div class="message-time-stamp">${message.time}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to select a chat
function selectChat(userId) {
    currentChatId = userId;
    
    // Update UI to show selected chat
    const userItems = document.querySelectorAll('.user-item');
    userItems.forEach(item => {
        if (parseInt(item.dataset.userId) === userId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update chat header
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
        document.getElementById('current-chat-name').textContent = selectedUser.name;
    }
    
    // Reset unread messages
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex].unread = 0;
        populateUsersList();
    }
    
    // Show messages
    showMessages(userId);
    
    // Show chat area on mobile
    document.querySelector('.users-sidebar').classList.remove('active');
}

// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById('message-text');
    const messageText = messageInput.value.trim();
    
    if (messageText && currentChatId) {
        // Get current time
        const now = new Date();
        const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');
        
        // Add message to data
        if (!chatMessages[currentChatId]) {
            chatMessages[currentChatId] = [];
        }
        
        chatMessages[currentChatId].push({
            sender: 'me',
            text: messageText,
            time: timeString
        });
        
        // Update last message in user list
        const userIndex = users.findIndex(user => user.id === currentChatId);
        if (userIndex !== -1) {
            users[userIndex].lastMessage = messageText;
            users[userIndex].time = 'Just now';
        }
        
        // Clear input
        messageInput.value = '';
        
        // Update UI
        showMessages(currentChatId);
        populateUsersList();
        
        // Simulate response after a delay (for demo purposes)
        simulateResponse(currentChatId);
    }
}

// Function to simulate a response
function simulateResponse(userId) {
    setTimeout(() => {
        const responses = [
            "That sounds good!",
            "I'll get back to you soon.",
            "Thanks for letting me know.",
            "Sure, no problem.",
            "I'll check it out!"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const now = new Date();
        const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');
        
        if (!chatMessages[userId]) {
            chatMessages[userId] = [];
        }
        
        chatMessages[userId].push({
            sender: 'them',
            text: randomResponse,
            time: timeString
        });
        
        // Update last message in user list
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            users[userIndex].lastMessage = randomResponse;
            users[userIndex].time = 'Just now';
            
            // Add unread message if not the current chat
            if (userId !== currentChatId) {
                users[userIndex].unread++;
            }
        }
        
        // Update UI if this is the current chat
        if (userId === currentChatId) {
            showMessages(userId);
        }
        
        populateUsersList();
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-users');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) || 
            user.lastMessage.toLowerCase().includes(searchTerm)
        );
        
        const userItems = document.querySelectorAll('.user-item');
        userItems.forEach(item => {
            const userId = parseInt(item.dataset.userId);
            const userExists = filteredUsers.some(user => user.id === userId);
            
            if (userExists) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Initialize the chat application
function initChat() {
    populateUsersList();
    
    // Set up event listeners
    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('message-text').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Select first chat by default
    if (users.length > 0) {
        selectChat(users[0].id);
    }
    
    // Setup search
    setupSearch();
    
    // Add mobile toggle functionality
    const chatHeader = document.querySelector('.chat-header');
    
    // Add mobile toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'btn btn-sm mobile-toggle me-2';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileToggle.addEventListener('click', () => {
        document.querySelector('.users-sidebar').classList.toggle('active');
    });
    
    chatHeader.insertBefore(mobileToggle, chatHeader.firstChild);
}

// When the DOM is fully loaded, initialize the chat
document.addEventListener('DOMContentLoaded', initChat);