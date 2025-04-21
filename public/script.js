

let currentChatId = null;

// // Fetch all users
async function fetchUsers() {
    const res = await fetch('/recent');
    const users = await res.json();
    populateUsersList(users);
}

// Fetch messages with a user
async function fetchMessages(userId) {
    const res = await fetch(`/messages/${userId}`);
    const messages = await res.json();
    showMessages(messages);
}

// Populate user list in sidebar
function populateUsersList(users) {
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';

    users.forEach(user => {
        const div = document.createElement('div');
        div.className = `user-item p-2 border-bottom ${user._id === currentChatId ? 'bg-light' : ''}`;
        div.dataset.userId = user._id;
        div.textContent = user.name;

        div.addEventListener('click', () => selectChat(user._id, user.name));
        usersList.appendChild(div);
    });
}

// Show chat messages
function showMessages(messages) {
    const container = document.getElementById('messages-container');
    container.innerHTML = '';

    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `message mb-2 ${msg.sender === 'me' ? 'text-end' : 'text-start'}`;
        div.innerHTML = `
            <div class="d-inline-block p-2 rounded ${msg.sender === 'me' ? 'bg-primary text-white' : 'bg-light'}">
                ${msg.text}
            </div>
            <div class="text-muted small">${new Date(msg.createdAt).toLocaleTimeString()}</div>
        `;
        container.appendChild(div);
    });

    container.scrollTop = container.scrollHeight;
}

// When user clicks on a user
async function selectChat(userId, userName) {
    currentChatId = userId;
    document.getElementById('current-chat-name').textContent = userName;
    await fetchMessages(userId);
}

// Send a message
async function sendMessage() {
    const input = document.getElementById('message-text');
    const text = input.value.trim();
    if (!text || !currentChatId) return;

    await fetch('/messages', {
        method: 'POST',
        headers: 
        { 'Content-Type': 'application/json' 

        },
        body: JSON.stringify({
             to: currentChatId, text 
            })
    });

    input.value = '';
    await fetchMessages(currentChatId);
}

// Search users
function setupSearch() {
    const searchInput = document.getElementById('search-users');
    const usersList = document.getElementById('users-list');

    searchInput.addEventListener('input', async () => {
        const term = searchInput.value.trim();

        if (term === "") {
            // Show default full user list
            await fetchUsers();
            return;
        }

        try {
            const res = await fetch(`/search?name=${encodeURIComponent(term)}`);
            const users = await res.json();
            populateUsersList(users);
        } catch (err) {
            console.error('Search failed', err);
        }
    });
} 

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    setupSearch();

    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('message-text').addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });
});
