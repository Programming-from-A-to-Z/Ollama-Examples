// Programming from A to Z
// https://github.com/Programming-from-A-to-Z/A2Z-F25

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
      model: 'deepseek-r1:14b',
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
      options: {
        temperature: 1.0,
      },
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let insideThink = false;
  let thinkBuffer = '';
  let answerBuffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log('done');
      break;
    }

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter((line) => line.trim() !== '');

    for (const line of lines) {
      const data = JSON.parse(line);
      if (data.done) {
        console.log('done');
      }
      if (data.message && data.message.content) {
        const text = data.message.content;

        fullText += text;

        // Check for <think> opening
        if (text.includes('<think>')) {
          insideThink = true;
        }

        // Check for </think> closing BEFORE accumulating
        if (text.includes('</think>')) {
          thinkBuffer += text;
          insideThink = false;
        } else {
          if (insideThink) {
            thinkBuffer += text;
          } else {
            answerBuffer += text;
          }
        }

        // Update displays (strip tags)
        thinkingText = thinkBuffer.replace(/<\/?think>/g, '');
        answerP.html(answerBuffer.replace(/<\/?think>/g, ''));
      }
    }
  }
}
