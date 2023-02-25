require("dotenv").config();
const { Configuration, OpenAIApi } = require('openai');
const { Telegraf } = require('telegraf');

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

let isPending = false

let interval = null

bot.on('message', async (ctx) => {
  const { text } = ctx.update.message

  isPending = true

  ctx.sendChatAction('typing')

  interval = setInterval(() => {
    console.log('isPending :>> ', isPending);
    if (isPending) {
      ctx.sendChatAction('typing')
    } else {
      clearInterval(interval)
    }
  }, 1000)

  const response = await askChatGPT(text);

  isPending = false
  clearInterval(interval)

  await ctx.reply(response)
});

bot.launch();