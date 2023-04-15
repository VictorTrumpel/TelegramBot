require("dotenv").config();

const PaymentMessage = '*Оракул - рабочий инструмент, основные ценности которого это скорость и стабильность.*'
  + '\n\n'
  + 'Тут вы никогда не увидите рекламы, ограничивающих вас токенов или принудительных подписок на мусорные каналы.'
  + '\n\n'
  + `Для бесплатного доступа у вас будет ${process.env.TRIAL_MESSAGE_COUNT} запросов в день.`
  + '\n\n'
  + `*Стоимость месячной подписки с неограниченным количеством запросов - ${process.env.SUBSCRIPTION_PRICE} рублей.*`
  + '\n\n'
  + '*Спасибо что поддерживаете нас!*'
  + '\n'
  + 'Это позволяет нам гарантировать стабильную работу бота и развивать его.'
  + '\n\n'
  + '*По всем вопросам пишите oracle.gpt.bot@gmail.com*'

const CheckImage = 'https://disk.yandex.ru/i/gt_nBhcQB5GEDg'

module.exports.PaymentMessage = PaymentMessage
module.exports.CheckImage = CheckImage