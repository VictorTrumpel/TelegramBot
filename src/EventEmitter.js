'use strict'

class EventEmitter {
  #handlers = new Map()

  once(eventName = '', cb = () => null) {
    const handlersStore = this.#getEventHandlers(eventName)

    const onceCallback = (...args) => {
      cb(...args)
      handlersStore.delete(onceCallback)
    }

    this.on(eventName, onceCallback)
  }

  on(eventName = '', cb = () => null) {
    const handlersStore = this.#getEventHandlers(eventName)

    handlersStore.add(cb)
  }

  emit(eventName = '', ...args) {
    const handlersStore = this.#getEventHandlers(eventName)

    handlersStore.forEach(cb => cb(...args))
  }

  off(eventName = '', cb) {
    const handlersStore = this.#getEventHandlers(eventName)

    
    if (cb) {
      handlersStore.delete(cb)
      return
    }

    handlersStore.clear()
  }

  #getEventHandlers(eventName = '') {
    let handlersStore = this.#handlers.get(eventName)

    if (handlersStore)
      return handlersStore

    handlersStore = new Set()

    this.#handlers.set(eventName, handlersStore)

    return handlersStore
  }
}

module.exports = EventEmitter