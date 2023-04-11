const functions = require('firebase-functions')
const data = require('./src/data')
const updateBtc = require('./src/updateBtc')
const updateBtcLatestBlock = require('./src/updateBtcLatestBlock')
const admin = require('firebase-admin')
admin.initializeApp()
const region = 'asia-northeast3'

exports.data = functions.region(region).https.onRequest(data)
exports.updateBtc = functions.region(region).https.onRequest(updateBtc)
exports.updateBtcLatestBlock = updateBtcLatestBlock
