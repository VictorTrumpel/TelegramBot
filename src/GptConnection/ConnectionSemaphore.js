'use strict'

const MapQueue = require('../MapQueue')

const MAX_ACTIVE_STREAM = process.env.MAX_ACTIVE_GPT_CONNECTIONS
class ConnectionSemaphore {
  static instance = null

  /**
    @key - connection id
    @value - GptStream instance
  */
  #activeConnections = new Map()

  #queueConnections = new MapQueue()

  constructor() {
    if (ConnectionSemaphore.instance) {
      return ConnectionSemaphore.instance
    }

    ConnectionSemaphore.instance = this
  }

  openNextConnection() {
    const openConnection = this.#queueConnections.shift()

    if (openConnection) {
      openConnection()
      return
    }

    if (this.#activeConnections > 0) {
      this.#activeConnections -= 1
    }
  }

  deleteConnection(connectionId = '') {
    const connection = this.#activeConnections.get(connectionId)

    this.#activeConnections.delete(connectionId)

    if (connection) {
      connection.abort()
    }

    // коннекшен из очереди не нужно абортить потому что он не запущен
    this.#queueConnections.delete(connectionId)
  }

  hasConnection(connectionId = '') {
    const connection = this.#activeConnections.get(connectionId)
    
    if (connection)
      return true

    const queueConnection = this.#queueConnections.get(connectionId)

    if (queueConnection)
      return true

    return false
  }

  pushConnectionOpener(connectionId = '', openConnection = () => undefined) {    
    if (this.#activeConnections.size === MAX_ACTIVE_STREAM) {
      this.#queueConnections.push(connectionId, openConnection)
      return
    }

    const connection = openConnection()

    this.#activeConnections.set(connectionId, connection)
  }
}

const connectionSemaphore = new ConnectionSemaphore()

module.exports.connectionSemaphore = connectionSemaphore