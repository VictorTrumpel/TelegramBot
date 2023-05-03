class Invoice {

  constructor({ invoiceOwnerId = Number(), isPaid = false }) {
    this.invoiceOwnerId = invoiceOwnerId
    this.isPaid = isPaid
  }

  getInfo() {
    return {
      invoiceOwnerId: this.invoiceOwnerId,
      isPaid: this.isPaid
    }
  }
}

module.exports = Invoice