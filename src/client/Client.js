const { userCRUD } = require('../database/UserCRUD');
const { getInvoice } = require('../getInvoice');
const { connectionSemaphore } = require('../GptConnection/ConnectionSemaphore')
const GptConnection = require('../GptConnection/GptConnection')

const MAX_BUFFER_MESSAGE_LENGTH = process.env.MAX_BUFFER_MESSAGE_LENGTH 

class Client {
  #text = ''
  #userId = NaN

  #ctx = {}

  isAnswerInProcess = false

  #bufferMessage = ''

  handleMessage = (message = '') => {
    this.#bufferMessage += message

    if (this.#bufferMessage.length >= MAX_BUFFER_MESSAGE_LENGTH) {
      this.#ctx.reply(this.#bufferMessage)

      // после того, как выполнится reply, если был статус 'typing' - он сбросится автоматически.
      // Сетаем его заново, т.к. ответ продолжает генериться, но с дилеем, иначе TG его не подхватит.
      setTimeout(() => {
        this.#ctx.sendChatAction('typing')
      }, 500)

      this.#bufferMessage = ''
    }
  }

  handleEndMessage = () => {
    if (this.#bufferMessage) {
      this.#ctx.reply(this.#bufferMessage)
    }

    this.#bufferMessage = ''

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
    // тут пока что говно-код.

    this.isAnswerInProcess = true

    this.#ctx.sendChatAction('typing')

    if (this.#text === '/start') {
      await userCRUD.createUserById(this.#userId)
  
      await this.#ctx.reply('Привет! Можешь задавать любой интересующий тебя вопрос! Для того, что бы остановить ответ, напши - "Стоп"')
  
      return
    }

    if (this.#ctx.update.message.successful_payment) {
      const user = await userCRUD.getUserById(this.#userId)
  
      user.updateLastPayment()
  
      await userCRUD.updateUser(user)
      
      return this.#ctx.reply("Оплата прошла успешно!")
    }

    const user = await userCRUD.getUserById(this.#userId)

    if (!user) {
      this.isAnswerInProcess = false
      return this.#ctx.reply('Нужно перезапустить бота, отправьте текст "/start"')
    }

    if (!user.hasAccess()) {
      this.isAnswerInProcess = false
      return this.#ctx.replyWithInvoice(
        getInvoice(this.#ctx.from.id)
      )
    }

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

    user.trialMessageCount -= 1

    await userCRUD.updateUser(user)

    const gptStream = await new GptConnection().createConnection(this.#userId)

    console.log('gptStream :>> ', gptStream);

    gptStream.ask(this.#text)

    gptStream.onChankMessage(this.handleMessage)

    gptStream.onResolve(this.handleEndMessage)
  }
}

module.exports = Client