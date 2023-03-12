require("dotenv").config();
const { Telegraf } = require('telegraf');
const { userCRUD } = require('./UserCRUD');
const MessageContext = require('./MessageContext')

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))

bot.on('message', async (ctx) => {
  const { text, from, successful_payment } = ctx.update.message
  const { id } = from

  if (text === '/start') {
    await userCRUD.createUserById(id)

    await ctx.reply('Привет! Можешь задавать любой интересующий тебя вопрос!')

    return
  }

  if (successful_payment) {
    const user = await userCRUD.getUserById(id)

    user.updateLastPayment()

    await userCRUD.updateUser(user)
    
    return ctx.reply("Оплата прошла успешно!")
  }

  new MessageContext(ctx)
})

bot.launch()