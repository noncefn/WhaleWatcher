const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({ origin: true }))

app.post('/', async (req, res) => {
  const { collection, address, data } = req.body
  const { weekStack, payCount }= txsChecker(data.txs)
  data.week_stack = weekStack
  data.pay_count = payCount
  const writeResult = await admin
    .firestore()
    .collection(collection)
    .doc(address)
    .set(data)
  res.send(writeResult)
})

module.exports = app

function txsChecker (txs) {
  const weekAgo = Date.now() - 604800000
  let weekStack = 0
  let payCount = 0
  txs.map(t => {
    if (t.time * 1000 >= weekAgo) {
      weekStack += t.result
      payCount++
    }
  })
  return { weekStack, payCount }
}
