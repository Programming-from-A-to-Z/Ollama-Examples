# Ollama Examples

A collection of basic examples for using [Ollama](https://ollama.com/) with client-side JavaScript. The Express server proxies requests to Ollama. This could be done directly via p5.js but this is best to avoid CORS issues as well as a foundation for plugging in other services and cloud-based LLMs.

1. Install dependencies:

```
npm install
```

2. Choose your LLM provider:

**Option A: Ollama (Local)**
- Make sure Ollama is running on your machine (http://localhost:11434)
- Start the server:
```
npm start
```

**Option B: OpenAI (Cloud)**
- Create a `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```
- Start the OpenAI server:
```
npm run openai
```

3. Open your browser to http://localhost:3000

## Resources

- [Ollama](https://ollama.com/) - Run LLMs locally
- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)

## Examples

- **1-chat** - streaming chatbot interface
- **2-code-generator** - generate and run p5.js sketches from text descriptions
- **3-vision** - image description of canvas drawings
