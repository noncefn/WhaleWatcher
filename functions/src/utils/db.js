
const functions = require("firebase-functions")
const admin = require('firebase-admin')
const { aWeekAgo } = require('./time')

const log = functions.logger.log

exports.getColData = async (col) => {
  const db = await admin.firestore()
  return await db
    .collection(col)
    .get()
}

exports.getDocData = async (col, doc) => {
  const db = await admin.firestore()
  return await db
    .collection(col)
    .doc(doc)
    .get()
}

exports.deleteOverAWeekOldTxs = async (batch) => {
  const db = await admin.firestore()
  const txRef = db.collection('bitcoin_address_tx')
  const aWeekAgoTime = aWeekAgo()
  const overAWeekOldTxs = await txRef.where('time', '<', aWeekAgoTime).get()
  const size = overAWeekOldTxs.size
  if (size === 0) {
    return
  }
  overAWeekOldTxs.forEach(t => {
    batch.delete(t.ref)
  })
  log(`@@ <${size}> Over a week old txs has been deleted @@`)
}

