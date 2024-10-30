// Get user input area
const userInput = document.getElementById('user-input');

// Adjust text area height based on content
userInput.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});

// Store conversation history
let conversationHistory = [];

// Add a message to the chat container
function appendMessage(who, message) {
  const chatContainer = document.getElementById('chat-container');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';

  // Create sender label and message content
  const roleSpan = document.createElement('span');
  roleSpan.className = who.toLowerCase();
  roleSpan.textContent = who + ': ';

  const contentSpan = document.createElement('span');
  contentSpan.className = 'message-content';
  contentSpan.textContent = message;

  // Add elements to message div and display it
  messageDiv.appendChild(roleSpan);
  messageDiv.appendChild(contentSpan);
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send and display a message
async function sendMessage() {
  const message = userInput.value;
  userInput.value = '';
  appendMessage('you', message);
  conversationHistory.push({ role: 'user', content: message });

  // Send message to Ollama's API
  try {
    const response = await fetch('http://localhost:11434/api
