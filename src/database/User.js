const SubDate = require('../SubDate');

const subDate = new SubDate()

const TRIAL_MESSAGE_COUNT = process.env.TRIAL_MESSAGE_COUNT

class User {
  #maxMemorySize = process.env.MAX_CONTEXT_SIZE

  constructor({ 
    id = 0, 
    trialMessageCount = TRIAL_MESSAGE_COUNT, 
    lastPaymentDate = '',
    lastQuestionDate = '',
    conversationMemory = ''
  }) {
    this.id = id
    this._trialMessageCount = trialMessageCount
    this.lastPaymentDate = lastPaymentDate
    this.lastQuestionDate = lastQuestionDate
    this.conversationMemory = conversationMemory 
  }

  get trialMessageCount() {
    return this._trialMessageCount
  }

  set trialMessageCount(count) {
    if (this._trialMessageCount > 0)
      this._trialMessageCount = count
  }

  pushMemory(dialogText = '') {
    const diffLastQuestionMin = subDate.getBetweenMinutes(new Date(), this.lastQuestionDate)
    const shouldForgetDialog = diffLastQuestionMin >= 15

    if (shouldForgetDialog)
      this.conversationMemory = ''

    if (this.conversationMemory.length + dialogText.length >= this.#maxMemorySize)
      this.releaseMemory(dialogText.length)

    this.conversationMemory += `\n${dialogText}`
  }

  releaseMemory(memorySize = Number()) {
    let startReleaseIdx = 0

    for (let i = 0; i < this.conversationMemory.length - 1; i++) {
      if (i >= memorySize && this.conversationMemory[i] === `\n`) {
        startReleaseIdx = i
        break
      }
    }

    const newMemory = this.conversationMemory.slice(startReleaseIdx)

    this.conversationMemory = newMemory
  }

  updateLastPayment() {
    this.lastPaymentDate = subDate.getMDYNow()
  }

  updateLastQuestionDate() {
    this.lastQuestionDate = subDate.getMDYHMSNow()
  }

  hasAccess() {
    const needInTrialMessages = subDate.getBetweenDays(
      this.lastQuestionDate,
      new Date(), 
    ) >= 1

    if (needInTrialMessages) {
      this._trialMessageCount = process.env.TRIAL_MESSAGE_COUNT
    }

    if (this.trialMessageCount > 0) 
      return true

    return subDate.isSubActual(this.lastPaymentDate)
  }

  getInfo() {
    return {
      id: this.id,
      trialMessageCount: this.trialMessageCount,
      lastPaymentDate: this.lastPaymentDate,
      lastQuestionDate: this.lastQuestionDate,
      conversationMemory: this.conversationMemory
    }
  }
}

module.exports = User