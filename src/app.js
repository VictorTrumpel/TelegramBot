'use strict'

require("dotenv").config();
const { Telegraf } = require('telegraf');
const Client = require('./client/Client');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))

bot.action('action', () => {
  
  console.log('GENER')
})

bot.on('message', async (ctx) => {
  new Client(ctx)
})

// пример того как можно выводить кнопки к сообщению:
// ctx.reply('прервать?', {
//   reply_markup: {
//     resize_keyboard: true,
//     inline_keyboard: [[{
//       text: 'Получить ответ',
//       callback_data: 'action'
//     }]]
//   }
// })


bot.launch()