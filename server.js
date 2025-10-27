import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Get available models
app.get('/api/tags', async (request, response) => {
  const ollamaResponse = await fetch('http://localhost:11434/api/tags');
  const data = await ollamaResponse.json();
  response.json(data);
});

// Chat without streaming
app.post('/api/chat', async (request, response) => {
  console.log('Model:', request.body.model);
  console.log('Messages:', request.body.messages);

  const ollamaResponse = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request.body),
  });

  console.log('Ollama response status:', ollamaResponse.status);
  const data = await ollamaResponse.json();
  console.log('sending response');
  response.json(data);
});

// Chat with streaming
app.post('/api/chat-streaming', async (request, response) => {
  console.log('Streaming request');
  console.log('Model:', request.body.model);
  console.log('Messages:', request.body.messages);

  const ollamaResponse = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request.body),
  });
  response.setHeader('Content-Type', 'text/plain');
  ollamaResponse.body.pipeTo(
    new WritableStream({
      write(chunk) {
        response.write(chunk);
      },
      close() {
        response.end();
      },
    })
  );
});

app.listen(port, serverReady);

function serverReady() {
  console.log(`http://localhost:${port}`);
}
