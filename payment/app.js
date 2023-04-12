'use strict'

require("dotenv").config();
const express = require('express');
const app = express()

app.use((req, res) => {
  res.sendFile(__dirname + req.url) 
})

app.listen(8080, () => {
  console.log('Сервер нейронки для разработки запущен на порту 8080');
});