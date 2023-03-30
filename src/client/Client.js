const { userCRUD } = require('../database/UserCRUD');
const { getInvoice } = require('../getInvoice');
const { connectionSemaphore } = require('../GptConnection/ConnectionSemaphore')
const GptConnection = require('../GptConnection/GptConnection')

const MAX_BUFFER_MESSAGE_LENGTH = process.env.MAX_BUFFER_MESSAGE_LENGTH 

class Client {
  #text = ''
  #userId = NaN

  #ctx = {}

  #userModel = null

  isAnswerInProcess = false

  #bufferMessage = ''

  handleMessage = (message = '') => {
    this.#bufferMessage += message

    if (this.#bufferMessage.length >= MAX_BUFFER_MESSAGE_LENGTH) {     
      const { reminder, release } = this.releaseBuffer(this.#bufferMessage) 

      this.#bufferMessage = reminder

      this.#ctx.reply(release)
      this.#userModel.pushMemory(release)
      userCRUD.updateUser(this.#userModel)

      // после того, как выполнится reply, если был статус 'typing' - он сбросится автоматически.
      // Сетаем его заново, т.к. ответ продолжает генериться, но с дилеем, иначе TG его не подхватит.
      setTimeout(() => {
        this.#ctx.sendChatAction('typing')
      }, 500)
    }
  }

  handleEndMessage = () => {
    if (this.#bufferMessage) {
      this.#userModel.pushMemory(this.#bufferMessage)
      userCRUD.updateUser(this.#userModel)
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

    const gptStream = await new GptConnection().createConnection(this.#userId)

    const textQuery = `${this.#userModel.conversationMemory}\n${this.text}`

    gptStream.ask(textQuery)

    gptStream.onChankMessage(this.handleMessage)

    gptStream.onResolve(this.handleEndMessage)
  }

  async autentificateUser(userId = Number()) {
    const user = await userCRUD.getUserById(userId)

    if (!user) {
      this.isAnswerInProcess = false
      this.#ctx.reply('Нужно перезапустить бота, отправьте текст "/start"')
      return null
    }

    if (!user.hasAccess()) {
      this.isAnswerInProcess = false
      this.#ctx.replyWithInvoice(getInvoice(this.#ctx.from.id))
      return null
    }

    return user
  }

  releaseBuffer(buffer = '') {
    let releaseIdx = buffer.length - 1

    for (let i = buffer.length - 1; i >= 0; i--) {
      const char = buffer[i]
      if (char === `\n` || char === ' ' || char === '   ') {
        releaseIdx = i
        break
      }
    }

    const reminder = buffer.slice(releaseIdx)
    const release  = buffer.slice(0, releaseIdx)

    return { reminder, release } 
  }
}

module.exports = Client