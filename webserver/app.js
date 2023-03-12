'use strict'

require("dotenv").config();
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const GptServer = require('../src/GptConnection/GptStreamConnection');

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

  const gptServer = new GptServer()

  gptServer.onMessage = (message) => {
    connection.send(message)
    // ctx.reply(message)
  }

  await gptServer.ask({ searchText: 'Расскажи сказку на 100 символов' })

  console.log('generated Stream :>> ')

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
})