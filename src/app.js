require("dotenv").config();
const { Configuration, OpenAIApi } = require('openai');
const TelegramBot = require('node-telegram-bot-api');

const telegramToken = process.env.TELEGRAM_TOKEN;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const telegramBot = new TelegramBot(telegramToken, { polling: true });

const askChatGPT = async (message) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    temperature: 0.6,
    max_tokens: 2000
  })

  return completion.data.choices[0].text
}

const emptyReg = new RegExp();

telegramBot.onText(emptyReg, async (msg) => {
  const { text } = msg;  

  const chatId = msg.chat.id;
  const response = await askChatGPT(text)

  telegramBot.sendMessage(chatId, response);
});