const createPayment = async ({ cost = 2 }) => {
  const response = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Idempotence-Key': `${Math.random() * Math.random() * Math.random()}`,
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + window.btoa(`208465:${process.env.YOO_CASSA}`)
    },
    body: JSON.stringify({
      amount: {
        value: `${cost}.00`,
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
            value: `${cost}.00`,
            currency: 'RUB'
          },
          vat_code: 1,
          quantity: 1
        }]
      }
    })
  })

  return await response.json()
}

