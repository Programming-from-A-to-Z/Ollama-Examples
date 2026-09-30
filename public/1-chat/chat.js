// Programming from A to Z
// https://github.com/Programming-from-A-to-Z/A2Z-F26

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
      model: 'gemma4',
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
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // A chunk can end partway through a line, so keep the leftover for next time
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (line.trim() === '') continue;
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
