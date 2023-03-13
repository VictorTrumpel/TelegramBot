'use strict'

const Queue = require('../Queue')

const MAX_ACTIVE_STREAM = process.env.MAX_ACTIVE_GPT_CONNECTIONS

class ConnectionSemaphore {
  static instance = null

  #activeConnections = 0

  #queueConnections = new Queue()

  constructor() {
    if (ConnectionSemaphore.instance) {
      return ConnectionSemaphore.instance
    }

    ConnectionSemaphore.instance = this
  }

  closeConnection() {
    const openConnection = this.#queueConnections.shift()

    if (openConnection) {
      openConnection()
      return
    }

    if (this.#activeConnections > 0) {
      this.#activeConnections -= 1
    }
  }

  pushConnectionOpener(openConnection = () => undefined) {
    if (this.#activeConnections === MAX_ACTIVE_STREAM) {
      this.#queueConnections.push(openConnection)
      return
    }

    this.#activeConnections += 1

    openConnection()
  }
}

const connectionSemaphore = new ConnectionSemaphore()

module.exports.connectionSemaphore = connectionSemaphore