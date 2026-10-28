import express from 'express';
import ollama from 'ollama';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Chat without streaming
app.post('/api/chat', async (request, response) => {
  console.log('Model:', request.body.model);
  console.log('Messages:', request.body.messages);

  // The browser sends everything Ollama needs (model, messages, stream: false, etc.)
  const reply = await ollama.chat(request.body);
  response.json(reply);
});

// Chat with streaming
app.post('/api/chat-streaming', async (request, response) => {
  console.log('Streaming request');
  console.log('Model:', request.body.model);
  console.log('Messages:', request.body.messages);

  // The browser sends stream: true, so this returns the reply in parts
  const stream = await ollama.chat(request.body);

  // Send the text of each part to the browser as soon as it arrives
  response.setHeader('Content-Type', 'text/plain');
  for await (const part of stream) {
    response.write(part.message.content);
  }
  response.end();
});

// Complete a prompt (no chat messages, just text in and text out)
app.post('/api/generate', async (request, response) => {
  console.log('Model:', request.body.model);
  console.log('Prompt:', request.body.prompt);

  const reply = await ollama.generate(request.body);
  response.json(reply);
});

// Decision ("System One") model: answers typed questions with probabilities
app.post('/api/systemone', async (request, response) => {
  console.log('Model:', request.body.model);
  console.log('State:', request.body.state);

  const result = await ollama.systemone(request.body);
  response.json(result);
});

app.listen(port, serverReady);

function serverReady() {
  console.log(`http://localhost:${port}`);
}
