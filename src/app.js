require("dotenv").config();
const { askChatGPT } = require('./askChatGpt');
const { getInvoice } = require('./getInvoice');
const { Telegraf } = require('telegraf');
const { userCRUD } = require('./UserCRUD')

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.hears('pay', (ctx) => ctx.replyWithInvoice(getInvoice(ctx.from.id)));

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));

bot.on('succesful_payment', async (ctx) => ctx.reply('SuccessfulPayment'));

let isPending = false

let interval = null

bot.on('message', async (ctx) => {
  const { text, from } = ctx.update.message
  const { id } = from

  if (text === '/start') {
    await userCRUD.createUserById(id)

    await ctx.reply('Привет! Можешь задавать любой интересующий тебя вопрос!')

    return
  }

  isPending = true

  ctx.sendChatAction('typing')

  interval = setInterval(() => {
    if (isPending) {
      ctx.sendChatAction('typing')
    } else {
      clearInterval(interval)
    }
  }, 1000)

  const user = await userCRUD.getUserById(id)

  if (!user)
    return ctx.reply("Пользователь не найден")

  if (!user.hasAccess()) {
    return ctx.replyWithInvoice(getInvoice(ctx.from.id))
  }

  user.trialMessageCount -= 1

  await userCRUD.updateUser(user)

  const response = await askChatGPT(text)

  isPending = false
  clearInterval(interval)

  await ctx.reply(response)
});

bot.launch();