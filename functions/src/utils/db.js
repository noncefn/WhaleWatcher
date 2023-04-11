
const functions = require("firebase-functions")
const admin = require('firebase-admin')
const { aWeekAgo } = require('./time')

exports.getColData = async function getColData (col, db) {
  const snapshot = await db
    .collection(col)
    .get()
  const address = {}
  snapshot.forEach(s => {
    address[s.id] = s.data()
  })
  return address
}

exports.getDocData = async function getDocData (col, doc, db) {
  const snapshot = await db
    .collection(col)
    .doc(doc)
    .get()
  return snapshot.data()
}

exports.deleteOverAWeekOldTxs = async function deleteOverAWeekOldTxs() {
  const db = await admin.firestore()
  const txRef = db.collection('bitcoin_address_tx')
  const aWeekAgoTime = aWeekAgo()
  const overAWeekOldTxs = await txRef.where('time', '<', aWeekAgoTime).get()
  const size = overAWeekOldTxs.size
  if (size === 0) {
    return
  }
  const batch = db.batch()
  overAWeekOldTxs.forEach(t => {
    batch.delete(t.ref)
  })
  await batch.commit()
  functions.logger.log(`@@ <${size}> Over a week old txs has been deleted @@`)
}

