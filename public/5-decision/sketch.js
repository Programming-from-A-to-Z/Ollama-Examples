// Programming from A to Z
// https://github.com/Programming-from-A-to-Z/A2Z-F26

// A decision ("System One") model doesn't generate text.
// It reads the input once and answers typed questions with probabilities.

let inputBox;
let answers;
let processing = false;

function setup() {
  createCanvas(600, 280);
  textFont('monospace');

  inputBox = createInput('Why does it always rain on the day I plan a picnic?!');
  inputBox.size(400);
  inputBox.input(decide);
  decide();
}

function draw() {
  background(0);
  if (!answers) return;

  fill(255);
  noStroke();
  textSize(20);

  // choice: which option it picked (the order of the options doesn't matter)
  text('mood: ' + answers.mood.choice, 20, 40);

  // and the probability of each mood
  textSize(14);
  let x = 20;
  for (let mood in answers.mood.probabilities) {
    text(mood + ' ' + round(answers.mood.probabilities[mood] * 100) + '%', x, 65);
    x += 120;
  }
  textSize(20);

  // noul: the probability of "yes"
  text('asking a question: ' + round(answers.question.noul * 100) + '% yes', 20, 110);

  // score: a number on a scale (the order matters), here from 0 (calm) to 2 (intense)
  text('intensity: ' + nf(answers.intensity.score, 1, 1), 20, 160);
  stroke(255);
  line(20, 210, 420, 210);
  noStroke();
  circle(map(answers.intensity.score, 0, 2, 20, 420), 210, 20);
  textSize(14);
  text('calm', 20, 240);
  text('moderate', 186, 240);
  text('intense', 360, 240);
}

async function decide() {
  // Only ask when there's text and the last request has finished
  if (!processing && inputBox.value() !== '') {
    processing = true;
    const response = await fetch('/api/systemone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nimble',
        state: inputBox.value(),
        questions: {
          // choice: pick one of these options
          mood: {
            type: 'choice',
            instructions: 'What is the mood of this text?',
            criteria: { happy: null, sad: null, angry: null, neutral: null },
          },
          // noul: a yes/no question
          question: {
            type: 'noul',
            instructions: 'Is the writer asking a question?',
          },
          // score: levels ordered from lowest to highest
          intensity: {
            type: 'score',
            instructions: 'How intense is the emotion in this text?',
            criteria: ['Calm', 'Moderate', 'Intense'],
          },
        },
      }),
    });

    const data = await response.json();
    console.log(data);
    answers = data.answers;
    processing = false;
  }
}
