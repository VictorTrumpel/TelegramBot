const { userCRUD } = require('../database/UserCRUD');
const { getInvoice } = require('../getInvoice');
const { connectionSemaphore } = require('../GptConnection/ConnectionSemaphore');
const GptConnection = require('../GptConnection/GptConnection');
const MessageFormatter = require('./MessageFormatter');
const PaymentSet = require('../PaymentSet');

class Client {
  #text = ''
  #userId = NaN

  #ctx = {}

  #userModel = null

  isAnswerInProcess = false

  #messageFormatter = new MessageFormatter()

  handleReply = (message = '') => {
    
    if (message.trim()) {
      this.#ctx.reply(message)
      this.#userModel.pushMemory(message)
      userCRUD.updateUser(this.#userModel)
    }

    // после того, как выполнится reply, если был статус 'typing' - он сбросится автоматически.
    // Сетаем его заново, т.к. ответ продолжает генериться, но с дилеем, иначе TG его не подхватит.
    setTimeout(() => {
      this.#ctx.sendChatAction('typing')
    }, 500)
  }

  handleEndMessage = () => {    
    const bufferMessage = this.#messageFormatter.getAndClearBuffer()

    if (bufferMessage.trim()) {
      this.#userModel.pushMemory(bufferMessage)
      userCRUD.updateUser(this.#userModel)
      this.#ctx.reply(bufferMessage)
    }

    this.isAnswerInProcess = false
  }

  constructor(context = {}) {
    const { text, from } = context.update.message
    const { id } = from

    this.#text = text
    this.#userId = id

    this.#ctx = context

    this.init()
  }

  async init() {
    this.isAnswerInProcess = true

    this.#ctx.sendChatAction('typing')

    if (this.#text === '/start') {
      await userCRUD.createUserById(this.#userId)
  
      await this.#ctx.reply('Привет! Можешь задавать любой интересующий тебя вопрос! Для того, что бы остановить ответ, напиши - "Стоп"')
  
      return
    }

    if (this.#ctx.update.message.successful_payment) {
      const user = await userCRUD.getUserById(this.#userId)
  
      user.updateLastPayment()
  
      await userCRUD.updateUser(user)
      
      return this.#ctx.reply("Оплата прошла успешно!")
    }

    this.#userModel = await this.autentificateUser(this.#userId)

    if (!this.#userModel)
      return

    if (this.#text === 'Стоп' || this.#text === 'СТОП' || this.#text === 'стоп') {
      connectionSemaphore.deleteConnection(this.#userId)
      return this.#ctx.reply('Можешь задать следующий вопрос :)')
    }

    const hasConnection = connectionSemaphore.hasConnection(this.#userId)

    if (hasConnection) {
      this.#ctx.reply('Отправте "Стоп" для того, что бы остановить ответ.')

      setTimeout(() => {
        this.#ctx.sendChatAction('typing')
      }, 500)

      return
    }

    this.#userModel.trialMessageCount -= 1
    this.#userModel.pushMemory(this.#text)
    this.#userModel.updateLastQuestionDate()

    await userCRUD.updateUser(this.#userModel)

    this.#messageFormatter.onReleaseMessage(
      this.handleReply
    )

    const gptStream = await new GptConnection().createConnection(this.#userId)

    const textQuery = `${this.#userModel.conversationMemory}\n${this.text}`

    gptStream.ask(textQuery)

    gptStream.onChankMessage((chunk) => {
      this.#messageFormatter.pushMessageChunk(chunk)
    })

    gptStream.onResolve(this.handleEndMessage)
  }

  async autentificateUser(userId = Number()) {
    const user = await userCRUD.getUserById(userId)

    if (!user) {
      this.isAnswerInProcess = false
      this.#ctx.reply('Нужно перезапустить бота, отправьте текст "/start"')
      return null
    }

    /** ОТКЛЮЧИЛ ОПЛАТУ **/
    if (!user.hasAccess()) {
      this.isAnswerInProcess = false

      PaymentSet.add(`${this.#userId}`)

      this.#ctx.reply('random example', {
        reply_markup: {
          inline_keyboard: [[{
            text: 'Перейти для оплаты',
            url: `${process.env.DOMEN_ADDRESS}/payment/${this.#userId}`,
          }]]
        }
      })

      return null
    }

    return user
  }
}

module.exports = Client