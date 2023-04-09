const functions = require("firebase-functions")
const data = require('./src/data')
const updateBtcLatestBlock = require('./src/updateBtcLatestBlock')
const admin = require('firebase-admin')
admin.initializeApp()
const region = 'asia-northeast3'

exports.data = functions.region(region).https.onRequest(data)
exports.updateBtcLatestBlock = updateBtcLatestBlock
