'use strict'

require("dotenv").config();
const { Telegraf } = require('telegraf');
const express = require('express');
const { createPaymentToken } = require('./createPaymentToken');
const cors = require('cors');
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
          text: 'Перейти для оплаты',
          url: `${process.env.PAYMENT_URL}412412`,
        }]]
      }
    }
  )


  // new Client(ctx)
})

paymentServer.use(cors())

paymentServer.get('/get_payment_token', async (req, res) => {
  const token = await createPaymentToken()
 
  return res.json(token)
})

paymentServer.listen(8000, () => {
  console.log('Сервер оплаты развернут на 8000 порту');
});

bot.launch()