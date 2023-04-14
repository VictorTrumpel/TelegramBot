require("dotenv").config();

async function getPaymentInfo(paymentId = '') {
  const response = await fetch(`${process.env.YOO_CASSA_API}/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${process.env.SHOP_ID}:${process.env.YOO_CASSA}`)
    },
  })

  const paymentInfo = await response.json()

  return paymentInfo
}

module.exports.getPaymentInfo = getPaymentInfo