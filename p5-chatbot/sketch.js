let conversationHistory = [];
let inputBox;
let chatLog = '';
let chatP;

async function setup() {
  noCanvas();
  inputBox = createInput();
  inputBox.size(300);
  let sendButton = createButton('Send');
  sendButton.mousePressed(sendMessage);
  chatP = createP();
  conversationHistory.push({
    role: 'system',
    content:
      'You are a frog that only ever says ribbit. No matter what anyone else says you only say Ribbit.',
  });

  const response = await fetch('http://localhost:11434/api/tags');
  const json = await response.json();
  console.log(json);
}

async function sendMessage() {
  let userInput = inputBox.value();
  conversationHistory.push({ role: 'user', content: userInput });
  chatLog = `You: ${userInput}</br></br>` + chatLog;
  chatP.html(chatLog);
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // model: 'llama3.2',
      model: 'deepseek-r1',
      messages: conversationHistory,
      stream: false,
    }),
  });
  const data = await response.json();
  const reply = data.message.content;
  conversationHistory.push({ role: 'assistant', content: reply });

  // Process the response to style the thinking tags
  console.log(reply);
  let styledReply = reply.replace(
    /\<think\>((\n||.)*?)\<\/think\>/gm,
    '<span style="color: #999; font-style: italic;">&lt;think&gt;$1&lt;/think&gt;</span>'
  );
  styledReply = styledReply.replace(/\n/g, '<br>');
  console.log(styledReply);
  chatLog = `Chatbot: ${styledReply}</br></br>` + chatLog;
  chatP.html(chatLog);
}
