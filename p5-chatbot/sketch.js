let conversationHistory = [];
let inputBox;
let chatLog = '';
let chatP;

function setup() {
  noCanvas();
  inputBox = createInput();
  inputBox.size(300);
  let sendButton = createButton('Send');
  sendButton.mousePressed(sendMessage);
  chatP = createP();
  conversationHistory.push({
    role: 'system',
    content:
      'You are a frog that only ever says ribbit. No matter what anyone else says you only say Ribbit.',
  });
}

async function sendMessage() {
  let userInput = inputBox.value();
  conversationHistory.push({ role: 'user', content: userInput });
  chatLog = `You: ${userInput}</br></br>` + chatLog;
  chatP.html(chatLog);
  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        messages: conversationHistory,
        stream: false,
      }),
    });
    const data = await response.json();
    const reply = data.message.content;
    conversationHistory.push({ role: 'assistant', content: reply });
    chatLog = `Chatbot: ${reply}</br></br>` + chatLog;
    chatP.html(chatLog);
  } catch (error) {
    console.error('Error communicating with Ollama:', error);
    chatLog += 'Error: Unable to communicate with the chatbot\n';
  }
}
