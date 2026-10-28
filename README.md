# Ollama Examples

This repo is a collection of basic examples for using [Ollama](https://ollama.com/) with client-side JavaScript. The Express server talks to Ollama with the [`ollama` JavaScript library](https://github.com/ollama/ollama-js) and passes the results along to the browser. This could be done directly via p5.js but this is best to avoid CORS issues and it serves as a foundation for plugging in other services and cloud-based LLMs.

1. Install dependencies:

```
npm install
```

2. Make sure Ollama is running on your machine (http://localhost:11434) and pull the models used by the examples:

```
ollama pull gemma4
ollama pull qwen3
ollama pull nimble
ollama pull llama3.2:1b-instruct-q4_K_M
ollama pull llama3.2:1b-text-q4_K_M
```

The decision model (nimble) example needs Ollama 0.35 or later!

3. Start the server:

```
npm start
```

4. Open your browser to http://localhost:3000

## Resources

- [Ollama](https://ollama.com/) - Run LLMs locally
- [Ollama JavaScript Library](https://github.com/ollama/ollama-js)
- [Ollama API Documentation](https://docs.ollama.com/api)
  - [Chat endpoint (`/api/chat`)](https://docs.ollama.com/api/chat)
  - [Streaming](https://docs.ollama.com/capabilities/streaming)
  - [Vision](https://docs.ollama.com/capabilities/vision)
  - [Thinking](https://docs.ollama.com/capabilities/thinking)
  - [Structured outputs](https://docs.ollama.com/capabilities/structured-outputs)
- [Jev-style decision models](https://ollama.com/blog/ollama-now-supports-jev-style-decision-models)

## Examples

- **1-chat** - streaming chatbot interface (`gemma4`)
- **2-code-generator** - generate and run p5.js sketches from text descriptions (`gemma4`)
- **3-vision** - image description of canvas drawings (`gemma4`)
- **4-reasoning** - one question three ways: answer only, "Let's think step by step," and thinking mode, with the reasoning and the token count for each (`qwen3`)
- **5-decision** - a "System One" decision model answers choice, yes/no, and score questions with probabilities instead of generating text (`nimble`)
- **6-structured-output** - get JSON back in an exact shape and draw with it (`gemma4`)
- **7-base-vs-instruct** - the same prompt to a base (pre-trained only) model and its instruct version (`llama3.2:1b-text-q4_K_M`, `llama3.2:1b-instruct-q4_K_M`)
