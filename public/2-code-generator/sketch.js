// Programming from A to Z
// https://github.com/Programming-from-A-to-Z/A2Z-F25

let currentSketch = null;

async function sendMessage() {
  const prompt = document.getElementById('prompt').value;

  const systemPrompt = `You are a p5.js code generator. Generate p5.js code in instance mode following this exact pattern:

window.sketch = function(p) {
  p.setup = function() {
    p.createCanvas(400, 400);
  }

  p.draw = function() {
    p.background(220);
    p.fill(0, 0, 255);
    p.circle(200, 200, 100);
  }
}

Important:
- Use window.sketch (not let sketch)
- Use p. prefix for ALL p5 functions
- Only define p.setup and p.draw
- Return only the code in a code block, no explanations`;

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma3',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      stream: false,
      options: {
        temperature: 1,
      },
    }),
  });

  const data = await response.json();
  const reply = data.message.content;
  console.log(reply);

  // Extract code from markdown code block
  const codeMatch = reply.match(/```(?:javascript|js)?\n([\s\S]*?)\n```/);
  if (codeMatch) {
    const code = codeMatch[1];
    console.log('Executing code:', code);

    // Remove old sketch if it exists
    if (currentSketch) {
      currentSketch.remove();
    }

    // Clear the container
    const container = document.getElementById('sketch-container');
    container.innerHTML = '';

    // Execute the code to define the sketch function
    eval(code);

    // Create new p5 sketch instance
    currentSketch = new p5(window.sketch, 'sketch-container');
  }
}
