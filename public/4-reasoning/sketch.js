// Programming from A to Z
// https://github.com/Programming-from-A-to-Z/A2Z-F26

// Ask the same question three ways and compare the answers
// and how many tokens each one costs.

let questionBox;
let answerOnlyColumn;
let stepByStepColumn;
let thinkingColumn;

function setup() {
  noCanvas();

  questionBox = createElement(
    'textarea',
    'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?'
  );

  let answerOnlyButton = createButton('Answer only');
  answerOnlyButton.mousePressed(askAnswerOnly);
  let stepByStepButton = createButton("Let's think step by step");
  stepByStepButton.mousePressed(askStepByStep);
  let thinkingButton = createButton('Thinking mode');
  thinkingButton.mousePressed(askThinking);

  // One column for each way of asking, below the buttons
  createElement('br');
  answerOnlyColumn = createDiv();
  answerOnlyColumn.class('column');
  stepByStepColumn = createDiv();
  stepByStepColumn.class('column');
  thinkingColumn = createDiv();
  thinkingColumn.class('column');
}

// 1. Just the answer, no thinking
function askAnswerOnly() {
  const prompt = questionBox.value() + ' Reply with only the answer.';
  ask('Answer only', prompt, false, answerOnlyColumn);
}

// 2. Ask the model to show its work in the answer itself
function askStepByStep() {
  const prompt = questionBox.value() + " Let's think step by step.";
  ask('Step by step', prompt, false, stepByStepColumn);
}

// 3. Thinking mode: the model reasons first, separately from the answer
function askThinking() {
  ask('Thinking mode', questionBox.value(), true, thinkingColumn);
}

async function ask(label, prompt, think, column) {
  column.html('<h3>' + label + '</h3><p>...</p>');

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen3',
      messages: [{ role: 'user', content: prompt }],
      think: think,
      stream: false,
    }),
  });
  const data = await response.json();

  // eval_count is how many tokens the model generated (thinking included)
  let html = '<h3>' + label + '</h3>';
  html += '<p><b>Tokens: ' + data.eval_count + '</b></p>';
  if (data.message.thinking) {
    html += '<div class="thinking">' + marked.parse(data.message.thinking) + '</div>';
  }
  // The model writes in markdown, so turn it into HTML (like ChatGPT does)
  html += marked.parse(data.message.content);
  column.html(html);
}
