(async () => {

const { token, expiredTime, error } = await getPaymentToken()

if (error) {
	document.querySelector('#header-info').innerText = error
	return
}

setTimeout(() => {
	document.querySelector('#payment-form').remove()
	document.querySelector('#header-info').innerText = 'Время оплаты истекло'
}, Number(expiredTime) - 1000)

const checkout = new window.YooMoneyCheckoutWidget({
	confirmation_token: token.confirmation.confirmation_token,
	test: true,	
	error_callback: function(error) { 
		console.log('error :>> ', error)
	},
  customization: {
    colors: {
      control_primary: '#00BF96',
      background: '#403f3f'
    }
  },
})

checkout.on('success', async () => {
	const response = await fetch(`/success_payment`, {
		method: 'POST',
		headers: {	
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify({
			userId: getUserId(),
			paymentId: token.id
		})
	})

	const { message, error } = await response.json()

	document.querySelector('#payment-form').remove()

	if (message) {
		document.querySelector('#header-info').innerText = message
		return
	}

	if (error) {
		document.querySelector('#header-info').innerText = error
		return
	}
})

checkout.render('payment-form');

function getUserId() {
	const pathName = window.location.pathname
	return pathName.split('/')[1]
}

async function getPaymentToken() {
	const userId = getUserId()

	const res = await fetch(`/get_payment_token/${userId}`)

	const token = await res.json()

	return token
}
})()