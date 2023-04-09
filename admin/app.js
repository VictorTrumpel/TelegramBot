'use strict'

/**
 * Сервер нейронки для разработки, для того, что бы не тратить токены
 * с реальной нейронки.
 */

require("dotenv").config();
const express = require('express');
const fs = require('fs');

const app = express()

app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html') })

app.post('/ask', async (req, res) => {
  const file = fs.readFileSync(`${__dirname}/responses/1.txt`, 'utf-8')

  const paragArray = file.split('\n').map((str) => str + '\n')

  const wait = () => new Promise((res) => setTimeout(() => res(), 10)) 

  for (let i = 0; i < paragArray.length; i++) {
    const parag = paragArray[i]

    for (let j = 0; j < parag.length; j++) {
      const char = parag[j] 

      const data = { choices: [{ delta: { content: char } }] } 

      const strData = JSON.stringify(data)
      const jsonStr = 'data: ' + strData

      res.write(jsonStr)

      await wait()
    }
  }

  res.end()
})

app.listen(8080, () => {
  console.log('Сервер нейронки для разработки запущен на порту 8080');
});