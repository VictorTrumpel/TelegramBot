const { userCRUD } = require('./UserCRUD');
const { getInvoice } = require('./getInvoice');
const GPTAnswerStream = require('./GptConnection/GptStream');

const MAX_BUFFER_MESSAGE_LENGTH = process.env.MAX_BUFFER_MESSAGE_LENGTH 

class MessageContext {
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
    this.isAnswerInProcess = true

    this.#ctx.sendChatAction('typing')

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

    user.trialMessageCount -= 1

    await userCRUD.updateUser(user)

    const gptStream = new GPTAnswerStream()

    gptStream.ask(this.#text)

    gptStream.onChankMessage(this.handleMessage)

    gptStream.onEnd(this.handleEndMessage)
  }
}

module.exports = MessageContext