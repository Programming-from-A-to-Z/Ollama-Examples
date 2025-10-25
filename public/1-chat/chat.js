// Programming from A to Z
// https://github.com/Programming-from-A-to-Z/A2Z-F25

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
  messageDiv.className = `message ${who.toLowerCase()}`;
  messageDiv.textContent = message;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send and display a message
async function sendMessage() {
  const message = userInput.value;
  userInput.value = '';
  userInput.style.height = 'auto';
  appendMessage('you', message);
  conversationHistory.push({ role: 'user', content: message });

  // Create empty chatbot message for streaming
  const chatContainer = document.getElementById('chat-container');
  const botMessage = document.createElement('div');
  botMessage.className = 'message chatbot';
  chatContainer.appendChild(botMessage);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Send message to Ollama's API
  const response = await fetch('/api/chat-streaming', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma3',
      messages: conversationHistory,
      stream: true,
      options: {
        temperature: 1,
      },
    }),
  });

  // Process the streaming response
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullReply = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter((line) => line.trim() !== '');

    for (const line of lines) {
      const data = JSON.parse(line);
      if (data.message && data.message.content) {
        fullReply += data.message.content;
        botMessage.textContent = fullReply;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }

  conversationHistory.push({ role: 'assistant', content: fullReply });
}
