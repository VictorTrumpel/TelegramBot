'use strict'

class Queue {
  #slots = []

  push(element) {
    this.#slots.push(element)
  }

  shift() {
    return this.#slots.shift()
  }
}

module.exports = Queue