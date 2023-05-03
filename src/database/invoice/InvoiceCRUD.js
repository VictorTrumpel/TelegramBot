const Invoice = require('./Invoice');
const { 
  setDoc, 
  doc, 
  getDoc 
} = require('firebase/firestore/lite');
const { db } = require('../db');

class InvoiceCRUD {
  #collectionName = "invoices"

  async getInvoiceByOwnerId(invoiceOwnerId = Number()) {
    const invoiceRef = doc(db, this.#collectionName, `${invoiceOwnerId}`)
    const invoiceResponse = await getDoc(invoiceRef)
    const invoiceInfo = invoiceResponse.data()

    return invoiceInfo ? new Invoice({ ...invoiceInfo }) : null
  }

  async createInvoiceByOwnerId(invoiceOwnerId = Number()) {
    await setDoc(
      doc(db, this.#collectionName, `${invoiceOwnerId}`), 
      new Invoice({ invoiceOwnerId }).getInfo()
    )
  }

  async updateInvoice(invoice = new Invoice()) {
    await setDoc(doc(db, this.#collectionName, `${invoice.invoiceOwnerId}`), invoice.getInfo())
  }
}

const invoiceCRUD = new InvoiceCRUD()

module.exports.invoiceCRUD = invoiceCRUD