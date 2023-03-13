class MapQueue {

  #mapQueue = new Map()

  shift() {
    const key = Array.from(this.#mapQueue)[0]?.[0]

    if (!key)
      return null
    
    const value = this.#mapQueue.get(key)

    this.#mapQueue.delete(key)

    return value
  }

  get(key = '') {
    const value = this.#mapQueue.get(key)

    return value
  }

  delete(key = '') {
    return this.#mapQueue.delete(key)
  }

  push(key = '', value) {
    this.#mapQueue.set(key, value)
  } 
}

module.exports = MapQueue