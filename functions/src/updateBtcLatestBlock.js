const functions = require("firebase-functions")
const admin = require('firebase-admin')
const axios = require('axios')
const { getColData, getDocData } = require('./utils/db')

const updateBtcLatestBlockUrl = `https://blockchain.info/latestblock`

const updateBtcLatestBlock = functions
  .region('asia-northeast3')
  .pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    try {
      const db = await admin.firestore()
      const ourLatestBlock = await getDocData('bitcoin_block', 'latest', db)
      const { data } = await axios.get(updateBtcLatestBlockUrl)
      const lastBlockHeight = data.height
      if (ourLatestBlock.height === lastBlockHeight) {
        functions.logger.log('Block is not updaed yet', lastBlockHeight)
        return null
      }
      const { data: block } = await axios.get(`https://blockchain.info/rawblock/${lastBlockHeight}`)
      const address = await getColData('bitcoin_address', db)
      const editedAddress = checkTxs(address, block)
      const objKeys = Object.keys(editedAddress)

      functions.logger.log(`blockHeight: ${lastBlockHeight}\n`, `txs length: ${block.tx.length}`)

      const batch = db.batch()
      if (objKeys.length === 0) {
        const blockTime = data.time
        latestBlockRef = db.collection('bitcoin_block').doc('latest')
        prevBlockRef = db.collection('bitcoin_block').doc('prev')
        batch.set(latestBlockRef, {
          height: lastBlockHeight, time: blockTime,
          time_to_create: blockTime - ourLatestBlock.time
        })
        batch.set(prevBlockRef, ourLatestBlock)
        await batch.commit()
        functions.logger.log('check complete without commit')
        return null
      }

      for (const addr of objKeys) {
        ref = db.collection('bitcoin_address').doc(addr)
        batch.set(ref, editedAddress[addr])
      }
      await batch.commit()
      functions.logger.log('check compelete', objKeys)
      return null
    } catch (e) {
      functions.logger.log('catch error\n', e)
    }
  })

function checkTxs(address, block) {
  const editedAddress = {}
  block.tx.map(t => {
    t.inputs.map(input => {
      if (input.prev_out.addr) {
        const addr = input.prev_out.addr
        if (address[addr]) {
          editedAddress[addr] = address[addr]
          editedAddress[addr].total_sent += input.prev_out.value
          editedAddress[addr].final_balance -= input.prev_out.value
        }
      }
    })
    t.out.map(utxo => {
      if (utxo.addr) {
        const addr = utxo.addr
        if (address[addr]) {
          if (!editedAddress[addr]) {
            editedAddress[addr] = address[addr]
          }
          editedAddress[addr].total_received += utxo.value
          editedAddress[addr].final_balance += utxo.value
        }
      }
    })
  })
  return editedAddress
}

module.exports = updateBtcLatestBlock