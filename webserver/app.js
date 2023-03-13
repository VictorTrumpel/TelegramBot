'use strict'

require("dotenv").config();
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const GptConnection = require('../src/GptConnection/GptConnection');

const index = fs.readFileSync('./webserver/index.html', 'utf-8')

const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end(index)
})

server.listen(8000, () => {
  console.log('Listen port 8000')
})

const ws = new WebSocket.Server({ server })

ws.on('connection', async (connection, req) => {
  const ip = req.socket.remoteAddress

  const gptConnection = await new GptConnection().createConnection()

  // console.log('gptConnection :>> ', gptConnection);

  gptConnection.ask('Расскажи сказку')

  gptConnection.onChankMessage((message) => {
    connection.send(message)
  })

  // connection.on('message', (message) => {
  //   console.log('Received: ', message)

  //   for (const client of ws.clients) {
  //     if (client.readyState !== WebSocket.OPEN) continue
  //     if (client === connection) continue
  //     client.send(message, { binary: false })
  //   }
  // })

  connection.on('close', () => {
    // console.log(`Disconnected ${ip}`)
  })

  connection.on('message', (message) => {
    const stringMessage = Buffer.from(message).toString('utf8')

    console.log('stringMessage :>> ', stringMessage);
    
    if (stringMessage === 'abort-gpt-stream') {
      gptConnection.abort()
    }
  })
})