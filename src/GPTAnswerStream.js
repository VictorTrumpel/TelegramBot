class GPTAnswerStream {

  #handleChankMessage = (chunkMessage = '') => undefined
  #handleFinisMessage = () => undefined

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
          this.#handleFinisMessage()
          return 
        }
  
        const jsonString = Buffer.from(value).toString('utf8').split('data: ')[1]
  
        if (jsonString.trim() === '[DONE]') {
          this.#handleFinisMessage()
          return
        }
  
        const parsedData = JSON.parse(jsonString)
    
        const chunkMessage = parsedData.choices?.[0]?.delta?.content
  
        this.#handleChankMessage(chunkMessage)
      } catch {
        this.#handleFinisMessage()
        return 
      }
    }
  }

  onChankMessage(cb = (chunkMessage = '') => undefined) {
    this.#handleChankMessage = cb
  } 

  onEnd(cb = () => undefined) {
    this.#handleFinisMessage = cb
  }
}

module.exports = GPTAnswerStream