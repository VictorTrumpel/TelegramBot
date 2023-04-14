require("dotenv").config();
const Invoice = require('./Invoice');
const SubDate = require('../SubDate');

class InvoicesCup {

  /**
    @key - user id
    @value - Invoice instance
  */
  #invoicesMap = new Map()

  static instance = null

  constructor() {
    if (InvoicesCup.instance) {
      return InvoicesCup.instance
    }

    InvoicesCup.instance = this

    // очищаем протухшие счета через определенный интервал
    setInterval(() => {
      this.clearRancidInvoices()
    }, process.env)
  }

  clearRancidInvoices() {
    const subData = new SubDate()
    
    for (const [invoiceKey, invoice] of this.#invoicesMap) {
      const invoiceLifeTime = subData.getBetweenMS(new Date(), invoice.dateOfCreate) 

      // если счет протух - удаляем его 
      if (invoiceLifeTime >= process.env.INVOIC_LIFETIME_MS) {
        this.#invoicesMap.delete(invoiceKey)
        continue
      }
    }
  }

  hasInvoice(userId = '') {
    return this.#invoicesMap.has(String(userId))
  }

  createInvoice(userId, onSuccessPaymet) {
    const invoice = new Invoice({ userId: String(userId), onSuccessPaymet })
    this.#invoicesMap.set(String(userId), invoice)
  } 

  resolveInvoice(userId = '') {
    const invoice =  this.#invoicesMap.get(String(userId))

    if (!invoice)
      return

    invoice.onSuccessPaymet()

    return this.#invoicesMap.delete(userId)
  }
}

const invoiceCup = new InvoicesCup()

module.exports.invoiceCup = invoiceCup