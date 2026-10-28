// Programming from A to Z
// https://github.com/Programming-from-A-to-Z/A2Z-F26

// The same prompt sent to two versions of Llama 3.2 1B:
// the base model (only pre-trained, it continues text)
// and the instruct model (post-trained to follow instructions and chat).

let inputBox;
let sendButton;
let baseP;
let instructP;

function setup() {
  noCanvas();

  inputBox = createInput('What is the capital of France?');
  inputBox.size(400);
  sendButton = createButton('Send to both');
  sendButton.mousePressed(sendToBoth);

  createElement('h3', 'Base model (pre-trained only)');
  baseP = createP('...');
  createElement('h3', 'Instruct model (post-trained)');
  instructP = createP('...');
}

async function sendToBoth() {
  baseP.html('...');
  instructP.html('...');

  // raw: true sends the prompt exactly as typed, no chat template
  const baseReply = await generate('llama3.2:1b-text-q4_K_M', true);
  baseP.html(baseReply);

  // without raw, Ollama wraps the prompt in the model's chat template
  const instructReply = await generate('llama3.2:1b-instruct-q4_K_M', false);
  instructP.html(instructReply);
}

async function generate(model, raw) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model,
      prompt: inputBox.value(),
      raw: raw,
      stream: false,
      options: {
        // keep the base model from rambling forever
        num_predict: 100,
      },
    }),
  });
  const data = await response.json();
  return data.response;
}
