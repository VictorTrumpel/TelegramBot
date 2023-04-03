'use strict'

require("dotenv").config();
const { Telegraf } = require('telegraf');
const Client = require('./client/Client');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))

bot.on('message', async (ctx) => {
  new Client(ctx)
})

bot.launch()