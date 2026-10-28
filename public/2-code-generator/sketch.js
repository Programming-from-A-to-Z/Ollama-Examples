// Programming from A to Z
// https://github.com/Programming-from-A-to-Z/A2Z-F26

let promptInput;
let sketchFrame;
let codeBox;

const systemPrompt = `You write p5.js sketches.
Reply with the complete JavaScript code for the sketch in a code block, with setup() and draw().
Make the canvas 400 by 400. No explanations.`;

function setup() {
  noCanvas();

  promptInput = createInput('draw a blue circle');
  promptInput.size(400);
  let generateButton = createButton('Generate');
  generateButton.mousePressed(generateSketch);

  // The generated sketch runs in its own little web page (an iframe),
  // the same way the p5.js web editor runs your sketches
  sketchFrame = createElement('iframe');
  sketchFrame.size(420, 420);
  sketchFrame.style('display', 'block');

  // Show the code the model wrote
  codeBox = createElement('textarea');
  codeBox.size(420, 300);
  codeBox.style('display', 'block');
}

async function generateSketch() {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: promptInput.value() },
      ],
      stream: false,
    }),
  });

  const data = await response.json();
  const reply = data.message.content;

  // Use a regular expression to pull the code out of the ``` code block
  const code = reply.match(/```\w*\n([\s\S]*?)```/)[1];
  codeBox.value(code);

  // Make a web page with p5.js and the new code, and load it into the iframe
  const page = `<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.13/p5.js"></script>
<script>${code}</script>`;
  sketchFrame.attribute('srcdoc', page);
}
