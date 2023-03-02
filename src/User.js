const SubDate = require('./SubDate');

const subDate = new SubDate()

class User {
  constructor({ 
    id = 0, 
    trialMessageCount = 5, 
    lastPaymentDate = ""
  }) {
    this.id = id
    this._trialMessageCount = trialMessageCount
    this.lastPaymentDate = lastPaymentDate
  }

  get trialMessageCount() {
    return this._trialMessageCount
  }

  set trialMessageCount(count) {
    if (this._trialMessageCount > 0)
      this._trialMessageCount = count
  }

  updateLastPayment() {
    const date = subDate.getMDYNow()
    this.lastPaymentDate = date
  }

  hasAccess() {
    if (this.trialMessageCount > 0) 
      return true

    return subDate.isSubActual(this.lastPaymentDate)
  }

  getInfo() {
    return {
      id: this.id,
      trialMessageCount: this.trialMessageCount,
      lastPaymentDate: this.lastPaymentDate
    }
  }
}

module.exports = User