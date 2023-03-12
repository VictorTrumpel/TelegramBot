'use strict'

const GptStream = require('./GptStream');

const MAX_ACTIVE_STREAM = 3

let activeStreams = 0

let streamsInPending = []

class GptStreamConnection {
  static instance = null

  onMessage = () => undefined

  onEnd = () => undefined

  handleStreamResolve = () => {
    if (activeStreams > 0) {
      activeStreams -= 1
    }

    const newStreamStarter = streamsInPending.shift()

    if (newStreamStarter) {
      activeStreams += 1
      newStreamStarter()
    }

    this.onEnd()
  }

  async ask({ userId = null, searchText = '' }) {
    const stream = await this.#createStream()

    stream.ask(searchText)

    stream.onChankMessage(this.onMessage)

    stream.onEnd(this.handleStreamResolve)
  }

  #createStream() {
    return new Promise((res) => {
      const stream = new GptStream()

      if (activeStreams === MAX_ACTIVE_STREAM) {
        streamsInPending.push(() => res(stream))
        return
      }

      activeStreams += 1

      res(stream)
    })
  }
}

module.exports = GptStreamConnection