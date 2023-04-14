'use strict'

require("dotenv").config();
const { Telegraf } = require('telegraf');
const { v4: uuidv4 } = require('uuid');
const { createPaymentToken } = require('./createPaymentToken');
const cors = require('cors');
const Client = require('./client/Client');
const express = require('express');
const https = require("https");
const fs = require('fs');
const PaymentSet = require('./PaymentSet');

/** TELEGRAM */
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))

bot.on('message', async (ctx) => new Client(ctx))

bot.launch()

/** WEB SERVER */

const isNginx = process.argv[2] === 'nginx'

const paymentServer = express()

paymentServer.use(cors())

paymentServer.get('/payment/:id', async (req, res) => 
  res.sendFile(__dirname + '/payment/index.html')
)

paymentServer.get('/get_payment_token/:id', async (req, res) => {
  const userId = req.url.split('/')[2]

  if (PaymentSet.has(userId)) {
    const token = await createPaymentToken(uuidv4())

    return res.json(token)
  }

  return res.json({ error: 'Вернитесь в бота' })
})

paymentServer.post('/success_payment', (req, res) => {
  console.log('req :>> ', req)
})

if (isNginx) {
  https
    .createServer({
      key: fs.readFileSync('/etc/letsencrypt/live/oracle-bot-payment.ru/fullchain.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/oracle-bot-payment.ru/privkey.pem'),
    }, paymentServer)
    .listen(4000, () => {
      console.log("serever is runing at port 4000");
    });
} else {
  paymentServer.listen(4000, () => {
    console.log("serever is runing at port 4000");
  })
}
