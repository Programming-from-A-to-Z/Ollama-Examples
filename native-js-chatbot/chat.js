// Access the user input text area
const userInput = document.getElementById('user-input');

// Event listener to adjust the height of the text area based on its content
userInput.addEventListener('input', function () {
  this.style.height = 'auto'; // Reset the height to default
  this.style.height = this.scrollHeight + 'px'; // Set the height based on the content
});

// Initialize an array to store the conversation history
let conversationHistory = [];

// Function to append a message to the chat container
function appendMessage(who, message) {
  // Access the chat container where messages will be displayed
  const chatContainer = document.getElementById('chat-container');
  // Create a new div element to hold the message
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message'; // Assign a class for styling

  // Create a span element to label the message sender
  const roleSpan = document.createElement('span');
  roleSpan.className = who.toLowerCase(); // Class based on the sender's role
  roleSpan.textContent = who + ': '; // Text to indicate the sender

  // Create a span element to contain the message text
  const contentSpan = document.createElement('span');
  contentSpan.className = 'message-content'; // Class for styling message content
  contentSpan.textContent = message; // The actual message text

  // Add the sender label and message content to the message div
  messageDiv.appendChild(roleSpan);
  messageDiv.appendChild(contentSpan);
  // Add the message div to the chat container
  chatContainer.appendChild(messageDiv);

  // Automatically scroll the chat container to the newest message
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Async function to handle sending messages
async function sendMessage() {
  const message = userInput.value;
  userInput.value = ''; // Clear input
  appendMessage('you', message); // Show user's message

  // Add user's message to conversation history
  conversationHistory.push({ role: 'user', content: message });

  // Try sending the message to Ollama's API
  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        messages: conversationHistory,
        stream: false,
      }),
    });

    // Parse the response from Ollama
    const data = await response.json();
    const reply = data.message.content;

    // Display and log the chatbot's response
    appendMessage('chatbot', reply);
    conversationHistory.push({ role: 'assistant', content: reply });
    console.log(JSON.stringify(conversationHistory, null, 2));
  } catch (error) {
    console.error('Error communicating with Ollama:', error); // Log errors
  }
}
