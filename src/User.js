class User {
  constructor({ 
    id = 0, 
    trialMessageCount = 5, 
    lastPaymentDate = null
  }) {
    this.id = id
    this.trialMessageCount = trialMessageCount
    this.lastPaymentDate = lastPaymentDate
  }
}

module.exports = User