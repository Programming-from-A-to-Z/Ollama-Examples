// Programming from A to Z
// https://github.com/Programming-from-A-to-Z/A2Z-F26

// Ask the model for JSON in an exact shape (a "schema")
// so the sketch can use the answer as data instead of text.

let inputBox;
let createButtonElement;
let character;

// The shape of the JSON we want back
const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    catchphrase: { type: 'string' },
    strength: { type: 'number' },
    speed: { type: 'number' },
    wisdom: { type: 'number' },
  },
  required: ['name', 'catchphrase', 'strength', 'speed', 'wisdom'],
};

function setup() {
  createCanvas(600, 300);
  textFont('monospace');

  inputBox = createInput('a frog who runs a tiny bakery');
  inputBox.size(400);
  createButtonElement = createButton('Create character');
  createButtonElement.mousePressed(createCharacter);
}

function draw() {
  background(0);
  if (!character) return;

  fill(255);
  textSize(28);
  text(character.name, 20, 50);
  textSize(16);
  text('"' + character.catchphrase + '"', 20, 85);

  // The numbers come back as real numbers, so we can draw with them
  drawStat('strength', character.strength, 140);
  drawStat('speed', character.speed, 180);
  drawStat('wisdom', character.wisdom, 220);
}

function drawStat(label, value, y) {
  fill(255);
  text(label, 20, y + 15);
  fill(0, 255, 0);
  rect(120, y, value * 40, 20);
}

async function createCharacter() {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma4',
      messages: [
        {
          role: 'user',
          content:
            'Invent a character based on this description: ' +
            inputBox.value() +
            '. Give strength, speed, and wisdom as numbers from 1 to 10.',
        },
      ],
      // Ollama makes the reply match this schema
      format: schema,
      stream: false,
    }),
  });

  const data = await response.json();
  console.log(data.message.content);

  // The reply is a string of JSON, so turn it into an object
  character = JSON.parse(data.message.content);
}
