'use strict'

require("dotenv").config();
const { Telegraf } = require('telegraf');
const express = require('express');
const Client = require('./client/Client');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

const paymentServer = express()

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


paymentServer.get('/', (req, res) => {
 
  res.json('Hello world')
})

paymentServer.listen(9999, () => {
  console.log('Сервер оплаты развернут на 9999 порту');
});

bot.launch()