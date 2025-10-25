// Programming from A to Z
// https://github.com/Programming-from-A-to-Z/A2Z-F25

let canvas;
let descriptionP;
let lastUpdateTime = 0;
let updateInterval = 3000; // Update every 3 seconds
let isProcessing = false;

function setup() {
  canvas = createCanvas(400, 400);
  createButton('clear').mousePressed(() => background(0));
  background(0);

  descriptionP = createP('...');
  descriptionP.style('font-size', '16px');
  descriptionP.style('max-width', '400px');
}

function draw() {
  // Draw with mouse
  if (mouseIsPressed) {
    fill(255);
    noStroke();
    circle(mouseX, mouseY, 20);
  }

  // Continously request new description
  if (!isProcessing) {
    getDescription();
  }
}

async function getDescription() {
  isProcessing = true;

  // Convert canvas to base64 image
  let canvasBase64 = canvas.elt.toDataURL('image/png').split(',')[1];

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma3',
      messages: [
        {
          role: 'user',
          content: 'Describe what you see in this image in one or two sentences.',
          images: [canvasBase64],
        },
      ],
      stream: false,
      options: {
        temperature: 1,
      },
    }),
  });

  const data = await response.json();
  const description = data.message.content;
  descriptionP.html(description);
  isProcessing = false;
}
