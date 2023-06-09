(() => {
  
const postButton = document.querySelector('#button')

postButton.addEventListener('click', async () => {
	const response = await fetch(`${window.origin}/ask`, { 
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
    	'Transfer-Encoding': 'chunked'
		}
	})

	const reader = response.body.getReader()

	while (true) {
		const { value } = await reader.read()

		if (!value) {
			return 
		}

		const bufferString = new TextDecoder("utf-8").decode(value)

		const jsonString = bufferString.split('data: ')[1]

		const parsedData = JSON.parse(jsonString)

		const chunkMessage = parsedData.choices?.[0]?.delta?.content

		console.log('chunkMessage :>> ', chunkMessage)
	}
})

})()