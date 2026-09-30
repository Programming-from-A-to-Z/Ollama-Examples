// Programming from A to Z
// https://github.com/Programming-from-A-to-Z/A2Z-F26

let inputBox;
let askButton;
let answerP;
let thinkingText = '';

function setup() {
  createCanvas(900, 600);
  textFont('monospace');
  textSize(16);

  inputBox = createInput('Why is the sky blue?');
  inputBox.size(400);
  askButton = createButton('Ask');
  askButton.mousePressed(askQuestion);

  createP('Answer:');
  answerP = createP('...');
  answerP.style('font-family', 'monospace');
}

function draw() {
  background(0);
  fill(0, 255, 0);
  textAlign(LEFT, TOP);
  text(thinkingText, 10, 10, width - 20, height - 40);
}

async function askQuestion() {
  thinkingText = '';
  answerP.html('Thinking...');

  const question = inputBox.value();

  const response = await fetch('/api/chat-streaming', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen3',
      messages: [
        {
          role: 'system',
          content: 'You think like a frog and give a very brief concise answer.',
        },
        {
          role: 'user',
          content: question + ' Remember you are a frog. But do not reference being a frog in your final answer.',
        },
      ],
      stream: true,
      // Ask Ollama to return the reasoning separately in message.thinking
      think: true,
      options: {
        temperature: 1.0,
      },
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let thinkBuffer = '';
  let answerBuffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log('done');
      break;
    }

    // A chunk can end partway through a line, so keep the leftover for next time
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (line.trim() === '') continue;
      const data = JSON.parse(line);
      if (data.message) {
        // Reasoning arrives in message.thinking, the final answer in message.content
        if (data.message.thinking) {
          thinkBuffer += data.message.thinking;
          thinkingText = thinkBuffer;
        }
        if (data.message.content) {
          answerBuffer += data.message.content;
          answerP.html(answerBuffer);
        }
      }
    }
  }
}
