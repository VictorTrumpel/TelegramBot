'use strict'

require("dotenv").config();
const { Telegraf } = require('telegraf');
const Client = require('./client/Client');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))

bot.on('message', async (ctx) => {


  return ctx.reply(
    'random example',
    {
      reply_markup: {
        inline_keyboard: [[{
          text: 'gdsgsd',
          web_app: { 
            url: process.env.PAYMENT_URL,
            init_data: 'gdsgds'
          },
        }]]
      }
    }
  )


  // new Client(ctx)
})

bot.launch()