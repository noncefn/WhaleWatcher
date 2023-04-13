const functions = require('firebase-functions')
// const testUpdateBtc = require('./src/updateBtcLatestBlock.test')
const updateBtcLatestBlock = require('./src/updateBtcLatestBlock')
const admin = require('firebase-admin')

admin.initializeApp()

const region = 'asia-northeast3'

// exports.testUpdateBtc = functions.region(region).https.onRequest(testUpdateBtc)
exports.updateBtcLatestBlock = functions
  .region(region)
  .pubsub
  .schedule('every 3 minutes')
  .onRun(updateBtcLatestBlock)
