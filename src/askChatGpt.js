require("dotenv").config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const askChatGPT = async (message) => {
  const completion = await openai.createCompletion({
    model: process.env.GPT_MODE,
    prompt: message,
    temperature: Number(process.env.TEMPERATURE),
    max_tokens: Number(process.env.MAX_RESPONSE_TOKENS)
  })

  return completion.data.choices[0].text
}

module.exports.askChatGPT = askChatGPT