const createPayment = async () => {
  const response = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Idempotence-Key': `${Math.random() * Math.random() * Math.random()}`,
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + window.btoa('208465:live_1rt1LgbcZhjkie_LMuKrz3Nuz4Dkjqz8g6iZdf9k5BM')
    },
    body: JSON.stringify({
      amount: {
        value: "2.00",
        currency: "RUB"
      },
      confirmation: {
        type: "embedded"
      },
      capture: true,
      description: "Заказ №72",
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
            value: '2.00',
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

