require("dotenv").config();
const { Configuration, OpenAIApi } = require('openai');
const { Telegraf } = require('telegraf');

console.log('Telegraf :>> ', Telegraf);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const askChatGPT = async (message) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    temperature: 0.6,
    max_tokens: 2000
  })

  return completion.data.choices[0].text
}

bot.on('message', async (ctx) => {
  const { text } = ctx.update.message

  ctx.sendChatAction('typing')

  const response = await askChatGPT(text);

  ctx.sendChatAction('typing')

  await ctx.reply(response)
});

bot.launch();