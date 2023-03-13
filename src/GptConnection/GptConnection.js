'use strict'
const { connectionSemaphore } = require('./ConnectionSemaphore');
const GptStream = require('./GptStream');

class GptConnection {
  #handleResolveStream = (connectionId = '') => {
    connectionSemaphore.deleteConnection(connectionId)
    connectionSemaphore.openNextConnection()
  }

  createConnection(connectionId = '') {
    return new Promise((res) => {
      const stream = new GptStream()

      stream.onResolve(() => this.#handleResolveStream(connectionId))

      const openConnection = () => {
        res(stream)
        return stream
      }

      connectionSemaphore.pushConnectionOpener(connectionId, openConnection)
    })
  }

  getConnection() {

  }
}

module.exports = GptConnection