'use strict'

require("dotenv").config();
const express = require('express');
const app = express()

// app.use((req, res) => {
//   res.sendFile(__dirname + .url) 
// })

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.listen(3000, () => {
  console.log('Сервер нейронки для разработки запущен на порту 3000');
});