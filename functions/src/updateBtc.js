const { getDocData } = require('./utils/db')
const functions = require("firebase-functions")
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({ origin: true }))

app.get('/', async (req, res) => {
  const db = await admin.firestore()
  const log = functions.logger.log
  const ourLatestBlock = await getDocData('bitcoin_block', 'latest', db)
  log(ourLatestBlock)
  res.send(ourLatestBlock)
})

module.exports = app
