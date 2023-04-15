class TypingStatus {

  action = ''

  #ctx = {}

  static instance = null

  constructor(ctx = {}) {
    if (TypingStatus.instance) {
      return TypingStatus.instance
    }

    this.#ctx = ctx

    TypingStatus.instance = this
  }

  sendAction() {
    if (this.action === 'typing')
      return

    this.action = 'typing'

    this.#ctx.sendChatAction('typing')

    setTimeout(() => {
      this.action = ''
    }, 5000)
  }
}

module.exports = TypingStatus