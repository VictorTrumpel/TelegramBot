'use strict'

const EventEmitter = require('../EventEmitter')
class GptStream {
  #eventEmitter = new EventEmitter()

  #isAborting = false

  #abortFetching = new AbortController()

  #chunkMessageEvent = 'message'
  #resolveStream = 'resolve'

  async ask(message = '') {
    try {
      const response = await fetch(process.env.GPT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.GPT_MODEL,
          messages: [{ role: "user", content: message }],
          temperature: 0.7,
          stream: true
        }),
        signal: this.#abortFetching.signal
      })
  
      const reader = response.body.getReader()
  
      while (true) {
        const { value } = await reader.read()
  
        if (!value || this.#isAborting) {
          this.#eventEmitter.emit(this.#resolveStream)
          return 
        }

        const bufferString = String(Buffer.from(value).toString('utf8'))
  
        const jsonString = bufferString.split('data: ')[1]
  
        if (jsonString.trim() === '[DONE]') {
          this.#eventEmitter.emit(this.#resolveStream)
          return
        }

        const parsedData = JSON.parse(jsonString)
    
        const chunkMessage = parsedData.choices?.[0]?.delta?.content

        this.#eventEmitter.emit(this.#chunkMessageEvent, chunkMessage)
      }
    } catch (error) {
      console.error(error)
      this.#eventEmitter.emit(this.#chunkMessageEvent, 'Не могу ответить на ваш вопрос :(')
      this.#eventEmitter.emit(this.#resolveStream)
      return 
    }
  }

  abort() {
    this.#isAborting = true
    this.#abortFetching.abort()
    this.#eventEmitter.emit(this.#resolveStream)
  }

  onChankMessage(cb = (chunkMessage = '') => undefined) {
    this.#eventEmitter.on(this.#chunkMessageEvent, cb)
  } 

  onResolve(cb = () => undefined) {
    this.#eventEmitter.on(this.#resolveStream, cb)
  }
}

module.exports = GptStream