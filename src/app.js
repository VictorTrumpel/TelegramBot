'use strict'

require("dotenv").config();
const { Telegraf } = require('telegraf');
const { v4: uuidv4 } = require('uuid');
const { createPaymentToken } = require('./cassa/createPaymentToken');
const { getPaymentInfo } = require('./cassa/getPaymentInfo'); 
const { invoiceCup } = require('./payment/InvoicesCup');
const cors = require('cors');
const Client = require('./client/Client');
const express = require('express');
const bodyParser = require('body-parser');

/** TELEGRAM */
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))

bot.on('message', async (ctx) => new Client(ctx))

bot.launch()

/** WEB SERVER */
const paymentServer = express()

paymentServer.use(cors())

paymentServer.use(bodyParser.json())
paymentServer.use(bodyParser.urlencoded({ extended: true }))


paymentServer.get('/', async (_, res) => 
  res.sendFile(__dirname + '/static/index.html')
)

paymentServer.get('/:id', async (_, res) => 
  res.sendFile(__dirname + '/static/index.html')
)

paymentServer.get('/get_payment_token/:id', async (req, res) => {
  const userId = req.url.split('/')[2]

  if (invoiceCup.hasInvoice(userId)) {
    const token = await createPaymentToken(uuidv4())

    return res.json({ token, expiredTime: process.env.INVOIC_LIFETIME_MS })
  }

  return res.json({ error: 'Счет не выставлен, вернитесь в бота' })
})

paymentServer.post('/success_payment', async (req, res) => {
  const { paymentId, userId } = req.body

  let paymentInfo = {}
  try {
    paymentInfo = await getPaymentInfo(paymentId)

  } catch {
    return res.json({ error: 'Нет информации о счете, вернитесь в бота.' })
  }

  if (!paymentInfo.paid) {
    return res.json({ error: 'Счет не оплачен.' })
  }

  invoiceCup.resolveInvoice(userId)

  res.json({ message: 'Оплата прошла успешно. Вернитесь в бота.' })
})

paymentServer.listen(8080, () => {
  console.log("serever is runing at port 8080");
})
