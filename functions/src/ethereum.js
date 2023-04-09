const admin = require('firebase-admin')
const functions = require("firebase-functions")
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({ origin: true }))

app.get('/', async (req, res) => {
  const original = req.query.text;
  const writeResult = await admin
    .firestore()
    .collection('ethereum')
    .add({original: original})
  functions.logger.log('EventLog', 'logTest-1', 'logTest-2')
  
  res.json({result: `Message with ID: ${writeResult.id} added.`})
})

app.get('/:id', async (req, res) => {
    res.send(req.params)
})


module.exports = app
