const EventEmitter = require('../EventEmitter')

const MAX_BUFFER_MESSAGE_LENGTH = process.env.MAX_BUFFER_MESSAGE_LENGTH 

class MessageFormatter {
  #eventEmitter = new EventEmitter()

  #bufferMessage = ''

  #releaseMessageEvent = 'release'

  getAndClearBuffer() {
    const buffer = this.#bufferMessage
    this.#bufferMessage = ''
    return buffer
  }
  
  pushMessageChunk(messageChunk = '') {
    this.#bufferMessage += messageChunk

    if (this.#bufferMessage.length >= MAX_BUFFER_MESSAGE_LENGTH) {     
      const { reminder, release } = this.#releaseBuffer(this.#bufferMessage) 

      this.#bufferMessage = reminder

      this.#eventEmitter.emit(this.#releaseMessageEvent, release)
    }
  }


  #releaseBuffer(buffer = '') {
    let releaseIdx = buffer.length - 1

    for (let i = buffer.length - 1; i >= 0; i--) {
      const char = buffer[i]
      if (char === `\n` || char === '   ') {
        releaseIdx = i
        break
      }
    }

    const reminder = buffer.slice(releaseIdx)
    const release  = buffer.slice(0, releaseIdx)

    return { reminder, release } 
  }

  // #analyzeBuffer() {
  //   const bufferRows = this.#bufferMessage.split('\n')

  //   if (bufferRows.length === 1) {
  //     let releaseIdx = 0

  //     for (let i = this.#bufferMessage.length - 1; i >= 0; i--) {
  //       const char = this.#bufferMessage[i]
  //       if (char === ' ') {
  //         releaseIdx = i
  //         break
  //       }
  //     }

  //     const reminder = this.#bufferMessage.slice(releaseIdx)
  //     const release  = this.#bufferMessage.slice(0, releaseIdx)
  
  //     return { reminder, release }
  //   }

  //   if (this.#bufferMessage.startsWith('```')) {
  //     let releaseText = ''

  //     for (let i = 0; i < bufferRows.length; i++) {
  //       const str = bufferRows[i]

  //       if (i !== 0 && str.startsWith('```')) {
  //         releaseText += str + '\n'
  //         break
  //       }

  //       releaseText += str + '\n'
  //     }

  //     const reminder = this.#bufferMessage.slice(releaseText.length)

  //     return { reminder, release: releaseText }
  //   }

  //   let releaseText = ''
    
  //   for (let i = 0; i < bufferRows.length; i++) {
  //     const str = bufferRows[i]

  //     if (i === bufferRows.length - 1) {
  //       break
  //     }

  //     if (str.startsWith('```')) {
  //       break
  //     }

  //     releaseText += str + '\n'
  //   } 

  //   const reminder = this.#bufferMessage.slice(releaseText.length)

  //   return { reminder, release: releaseText }
  // }

  onReleaseMessage(cb = (message = '') => null) {
    this.#eventEmitter.on(this.#releaseMessageEvent, cb)
  }
}

module.exports = MessageFormatter