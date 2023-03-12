'use strict'

require("dotenv").config();
const { Telegraf, Markup } = require('telegraf');
const { userCRUD } = require('./UserCRUD');
const GptServer = require('./GptConnection/GptStreamConnection');
const MessageContext = require('./MessageContext');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))

bot.action('action', () => {
  
  console.log('GENER')
})

bot.on('message', async (ctx) => {
  const { text, from, successful_payment } = ctx.update.message
  const { id } = from

  // ctx.reply('прервать?', {
  //   reply_markup: {
  //     resize_keyboard: true,
  //     inline_keyboard: [[{
  //       text: 'Получить ответ',
  //       callback_data: 'action'
  //     }]]
  //   }
  // })

  const gptServer = new GptServer()

  gptServer.onMessage = (message) => {
    console.log('message :>> ', message)
    // ctx.reply(message)
  }

  await gptServer.ask(text)

  
  // if (text === '/start') {
  //   await userCRUD.createUserById(id)

  //   await ctx.reply('Привет! Можешь задавать любой интересующий тебя вопрос!')

  //   return
  // }

  // if (successful_payment) {
  //   const user = await userCRUD.getUserById(id)

  //   user.updateLastPayment()

  //   await userCRUD.updateUser(user)
    
  //   return ctx.reply("Оплата прошла успешно!")
  // }

  // new MessageContext(ctx)
})



bot.launch()