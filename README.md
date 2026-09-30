# Ollama Examples

A collection of basic examples for using [Ollama](https://ollama.com/) with client-side JavaScript. The Express server proxies requests to Ollama. This could be done directly via p5.js but this is best to avoid CORS issues as well as a foundation for plugging in other services and cloud-based LLMs.

1. Install dependencies:

```
npm install
```

2. Make sure Ollama is running on your machine (http://localhost:11434) and pull the models used by the examples:

```
ollama pull gemma4
ollama pull qwen3
```

3. Start the server:

```
npm start
```

4. Open your browser to http://localhost:3000

## Resources

- [Ollama](https://ollama.com/) - Run LLMs locally
- [Ollama API Documentation](https://docs.ollama.com/api)
  - [Chat endpoint (`/api/chat`)](https://docs.ollama.com/api/chat)
  - [Streaming](https://docs.ollama.com/capabilities/streaming)
  - [Vision](https://docs.ollama.com/capabilities/vision)
  - [Thinking](https://docs.ollama.com/capabilities/thinking)

## Examples

- **1-chat** - streaming chatbot interface (`gemma4`)
- **2-code-generator** - generate and run p5.js sketches from text descriptions (`gemma4`)
- **3-vision** - image description of canvas drawings (`gemma4`)
- **4-reasoning** - streams a reasoning model's "thinking" separately from its final answer (`qwen3`)
