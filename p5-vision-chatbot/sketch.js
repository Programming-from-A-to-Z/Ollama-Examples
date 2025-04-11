// Machine Learning for Creative Coding
// https://github.com/shiffman/ML-for-Creative-Coding

// Based on Alan Ren's example code
// https://github.com/alanvww/Ollama-Llama-3.2-Vision-p5js-Chatbot

let conversationHistory = [];
let inputBox;
let chatLog = '';
let chatP;
let canvas;

function setup() {
  // Create canvas with a circle in the center
  canvas = createCanvas(300, 300);
  background(240);
  fill(255, 0, 0);
  circle(width / 2, height / 2, 100);

  // Create input elements
  createP('');
  inputBox = createInput('what is in the image?');
  inputBox.size(300);
  let sendButton = createButton('Send');
  sendButton.mousePressed(sendMessage);

  chatP = createP();
}

async function sendMessage() {
  let userInput = inputBox.value();

  // Convert canvas to base64 image
  let canvasBase64 = canvas.elt.toDataURL('image/png').split(',')[1];

  // Create user message with image
  let userMessage = {
    role: 'user',
    content: userInput,
    images: [canvasBase64],
  };

  // Add to conversation history
  conversationHistory.push(userMessage);

  // Update chat display
  chatLog = `You: ${userInput} [Canvas image sent]</br></br>` + chatLog;
  chatP.html(chatLog);

  // Show loading message
  let loadingText = 'Processing...';
  chatLog = `Chatbot: ${loadingText}</br></br>` + chatLog;
  chatP.html(chatLog);

  console.log(conversationHistory);

  // Send request to Ollama
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2-vision',
      messages: conversationHistory,
      stream: false,
    }),
  });

  const data = await response.json();
  const reply = data.message.content;

  // Add the response to conversation history
  conversationHistory.push({ role: 'assistant', content: reply });

  // Update chat display with the response
  chatLog = chatLog.replace(loadingText, reply.replace(/\n/g, '<br>'));
  chatP.html(chatLog);
}
