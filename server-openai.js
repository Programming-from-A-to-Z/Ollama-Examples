import express from 'express';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Chat without streaming
app.post('/api/chat', async (request, response) => {
  const { messages, options } = request.body;

  // Format the data for OpenAI (including an image if provided)
  const openaiMessages = messages.map((msg) => {
    if (msg.images && msg.images.length > 0) {
      return {
        role: msg.role,
        content: [
          { type: 'text', text: msg.content },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${msg.images[0]}`,
            },
          },
        ],
      };
    }
    return msg;
  });

  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: openaiMessages,
      temperature: options?.temperature,
    }),
  });

  const data = await openaiResponse.json();

  // Convert OpenAI format to Ollama format to use with same examples
  const ollamaFormat = {
    message: {
      role: data.choices[0].message.role,
      content: data.choices[0].message.content,
    },
  };

  response.json(ollamaFormat);
});

// Chat with streaming
app.post('/api/chat-streaming', async (request, response) => {
  const { messages, options } = request.body;

  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: messages,
      temperature: options?.temperature,
      stream: true,
    }),
  });

  response.setHeader('Content-Type', 'text/plain');

  const reader = openaiResponse.body.getReader();
  const decoder = new TextDecoder();
  let chunkCount = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log('Streaming complete. Total chunks:', chunkCount);
      break;
    }

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter((line) => line.trim() !== '');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        const parsed = JSON.parse(data);
        const content = parsed.choices[0]?.delta?.content || '';

        if (content) {
          chunkCount++;

          // Send back in ollama format
          const ollamaChunk = JSON.stringify({
            message: { content: content },
            done: false,
          });
          response.write(ollamaChunk + '\n');
        }
      }
    }
  }

  response.write(JSON.stringify({ done: true }) + '\n');
  response.end();
});

app.listen(port, serverReady);

function serverReady() {
  console.log(`http://localhost:${port}`);
}
