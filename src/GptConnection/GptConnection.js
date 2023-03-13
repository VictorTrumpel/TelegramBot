'use strict'
const { connectionSemaphore } = require('./ConnectionSemaphore')
const GptStream = require('./GptStream');

class GptConnection {
  #handleResolveStream = () => {
    // тут будет реализована доп логика по остановке GptStream

    connectionSemaphore.closeConnection()
  }

  createConnection() {
    return new Promise((res) => {
      const stream = new GptStream()

      stream.onResolve(this.#handleResolveStream)

      const openConnection = () => res(stream)

      connectionSemaphore.pushConnectionOpener(openConnection)
    })
  }
}

module.exports = GptConnection