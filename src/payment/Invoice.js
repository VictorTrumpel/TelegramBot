class Invoice {
  #userId = ''
  #dateOfCreate = new Date()

  constructor({ userId, onSuccessPaymet }) {
    this.#userId = userId
    this.onSuccessPaymet = onSuccessPaymet
  }

  get dateOfCreate() {
    return this.#dateOfCreate
  }
}

module.exports = Invoice