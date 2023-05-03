'use strict'

require("dotenv").config();
const { Telegraf } = require('telegraf');
const { v4: uuidv4 } = require('uuid');
const { createPaymentToken } = require('./cassa/createPaymentToken');
const { getPaymentInfo } = require('./cassa/getPaymentInfo'); 
const { userCRUD } = require('./database/user/UserCRUD');
const { invoiceCRUD } = require('./database/invoice/InvoiceCRUD');
const Invoice = require('./database/invoice/Invoice');
const cors = require('cors');
const Client = require('./tg-client/Client');
const TypingStatus = require('./TypingStatus');
const express = require('express');
const bodyParser = require('body-parser');

/** TELEGRAM */
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))

bot.on('message', async (ctx) => {
  try {
    new TypingStatus(ctx)
    new Client(ctx)
  } catch {
    ctx.reply('Попроси меня продолжить, если ответ недостаточно полный')
  }
})

bot.action('check_payment', async (ctx) => {
  const userId = ctx.update.callback_query.from.id

  const invoiceInfo = await invoiceCRUD.getInvoiceByOwnerId(Number(userId))

  if (invoiceInfo?.isPaid === true)
    return ctx.reply('Оплата прошла успешно ✅')
  else 
    return ctx.reply('Счет не оплачен ❌')
})

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

  const invoiceInfo = await invoiceCRUD.getInvoiceByOwnerId(Number(userId))

  if (invoiceInfo?.isPaid === false) {
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
 
  try {
    if (paymentInfo.paid) {
      const user = await userCRUD.getUserById(userId)
  
      user.updateLastPayment()
  
      await userCRUD.updateUser(user)
  
      const paidInvoice = new Invoice({ invoiceOwnerId: userId, isPaid: true })

      invoiceCRUD.updateInvoice(paidInvoice)
  
      return res.json({ message: 'Оплата прошла успешно. Можете продолжить общение с ботом.' })
    }
  } catch {
    return res.json({ error: 'Пользователя не существует. Если возникла ошибка, напишите нам на почту: oracle.gpt.bot@gmail.com' })
  }

  return res.json({ error: 'Счет не оплачен. Если возникла ошибка, напишите нам на почту: oracle.gpt.bot@gmail.com' })
})

paymentServer.listen(8080, () => {
  console.log("serever is runing at port 8080");
})
