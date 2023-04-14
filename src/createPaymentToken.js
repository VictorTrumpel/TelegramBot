const createPaymentToken = async (uuid) => {

  const response = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Idempotence-Key': `${uuid}`,
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`213674:test_gscgu3gpdWfabyJSGiDrXyrBeV-_0JKoM8b0cuQG034`)
    },
    body: JSON.stringify({
      amount: {
        value: `1.00`,
        currency: "RUB"
      },
      confirmation: {
        type: "embedded"
      },
      capture: true,
      description: "Оплата чат-бота",
      receipt: {
        customer: {
          full_name: 'Трумпель Виктор Дмитриевич',
          inn: '290501305013',
          email: 'victor.trumpel@gmail.com',
          phone: '79212961211'
        },
        items: [{
          description: 'Доступ к чат боту',
          amount: {
            value: `1.00`,
            currency: 'RUB'
          },
          vat_code: 1,
          quantity: 1
        }]
      },
      test: true,
    })
  })

  // const response = await fetch('https://api.yookassa.ru/v3/payments', {
  //   method: 'POST',
  //   headers: {
  //     'Idempotence-Key': `${uuid}`,
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Basic ' + btoa(`208465:${process.env.YOO_CASSA}`)
  //   },
  //   body: JSON.stringify({
  //     amount: {
  //       value: `1.00`,
  //       currency: "RUB"
  //     },
  //     confirmation: {
  //       type: "embedded"
  //     },
  //     capture: true,
  //     description: "Оплата чат-бота",
  //     receipt: {
  //       customer: {
  //         full_name: 'Трумпель Виктор Дмитриевич',
  //         inn: '290501305013',
  //         email: 'victor.trumpel@gmail.com',
  //         phone: '79212961211'
  //       },
  //       items: [{
  //         description: 'Доступ к чат боту',
  //         amount: {
  //           value: `1.00`,
  //           currency: 'RUB'
  //         },
  //         vat_code: 1,
  //         quantity: 1
  //       }]
  //     },
  //     test: true,
  //   })
  // })

  return await response.json()
}

module.exports.createPaymentToken = createPaymentToken