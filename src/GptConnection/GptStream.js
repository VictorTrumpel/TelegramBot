'use strict'

const EventEmitter = require('../EventEmitter')
class GptStream {
  #eventEmitter = new EventEmitter()

  #chunkMessageEvent = 'message'
  #resolveStream = 'resolve'

  async ask(message = '') {
    const response = await fetch(process.env.GPT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
        stream: true
      })
    })

    const reader = response.body.getReader()

    while (true) {
      try {
        const { value } = await reader.read()

        if (!value) {
          this.#eventEmitter.emit(this.#resolveStream)
          return 
        }
  
        const jsonString = Buffer.from(value).toString('utf8').split('data: ')[1]
  
        if (jsonString.trim() === '[DONE]') {
          this.#eventEmitter.emit(this.#resolveStream)
          return
        }
  
        const parsedData = JSON.parse(jsonString)
    
        const chunkMessage = parsedData.choices?.[0]?.delta?.content
  
        this.#eventEmitter.emit(this.#chunkMessageEvent, chunkMessage)
      } catch {
        this.#eventEmitter.emit(this.#resolveStream)
        return 
      }
    }
  }

  onChankMessage(cb = (chunkMessage = '') => undefined) {
    this.#eventEmitter.on(this.#chunkMessageEvent, cb)
  } 

  onResolve(cb = () => undefined) {
    this.#eventEmitter.on(this.#resolveStream, cb)
  }
}

module.exports = GptStream