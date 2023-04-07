const EventEmitter = require('../EventEmitter')

const MAX_BUFFER_MESSAGE_LENGTH = process.env.MAX_BUFFER_MESSAGE_LENGTH 

class MessageFormatter {
  #eventEmitter = new EventEmitter()

  #bufferMessage = ''

  #releaseMessageEvent = 'releaseMessageEvent'

  pushMessage(message = '') {
    this.#bufferMessage += message

    if (this.#bufferMessage.length >= MAX_BUFFER_MESSAGE_LENGTH) {
      const { reminder, release } = this.releaseBuffer(this.#bufferMessage) 

      this.#bufferMessage = reminder
    }
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

  onReleaseMessage(cb = (message = '') => undefined) {
    this.#eventEmitter.on(this.#releaseMessageEvent, cb)
  }
}