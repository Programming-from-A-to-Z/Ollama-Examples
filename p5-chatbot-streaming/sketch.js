let conversationHistory = [];
let inputBox;
let chatP;
let isStreaming = false;
let currentSpan = null;

async function setup() {
  noCanvas();
  inputBox = createInput();
  inputBox.size(300);
  let sendButton = createButton('Send');
  sendButton.mousePressed(sendMessage);
  chatP = createElement('div');
}

async function sendMessage() {
  // Prevent multiple requests while streaming
  if (isStreaming) return;

  let userInput = inputBox.value();
  inputBox.value('');
  conversationHistory.push({ role: 'user', content: userInput });

  // Create element for user message
  let userDiv = createElement('div');
  userDiv.html(`You: ${userInput}`);
  chatP.child(userDiv);

  // Create element for bot message
  isStreaming = true;
  let responseId = 'streaming-' + Date.now();
  let botDiv = createElement('div');
  botDiv.html(`Chatbot: <span id="${responseId}"></span>`);
  chatP.child(botDiv);

  // Fill this with the streaming content
  currentSpan = document.getElementById(responseId);

  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'deepseek-r1',
      messages: conversationHistory,
      stream: true,
    }),
  });

  // Process the streaming response
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Convert the binary chunk to text
    const chunk = decoder.decode(value, { stream: true });

    // Split by newlines as Ollama sends JSON objects per line
    const lines = chunk.split('\n').filter((line) => line.trim() !== '');

    for (const line of lines) {
      const data = JSON.parse(line);

      if (data.message) {
        // Get the stuff
        let content = data.message.content;
        content = content.replace(/\</g, '&lt;');
        content = content.replace(/\>/g, '&gt;');
        content = content.replace(/\n/g, '<br>');
        // Add new content to the span
        currentSpan.innerHTML += content;
      }

      if (data.done) {
        // After stream completes, store in conversation history
        const reply = currentSpan.innerHTML;
        conversationHistory.push({ role: 'assistant', content: reply });
        isStreaming = false;
      }
    }
  }
}
