class TypingStatus {

  action = ''

  #ctx = {}

  #timer = null

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

    if (this.#timer) {
      clearTimeout(this.#timer)
    }

    this.action = 'typing'

    this.#ctx.sendChatAction('typing')

    this.#timer = setTimeout(() => {
      this.action = ''
    }, 5000)
  }
}

module.exports = TypingStatus