const { getDocData, getColData, deleteOverAWeekOldTxs } = require('./utils/db')
const functions = require("firebase-functions")
const admin = require('firebase-admin')
const axios = require('axios')

const btcLatestBlockUrl = `https://blockchain.info/latestblock`
const btcSingleblockUrl = `https://blockchain.info/rawblock`
const log = functions.logger.log

module.exports = async (req, res) => {
  try {
    const db = await admin.firestore()

    const ourLatestBlockRef = await getDocData('bitcoin_block', 'latest')
    const ourLatestBlock = ourLatestBlockRef.data()

    const { data } = await axios.get(btcLatestBlockUrl)
    const lastBlockHeight = data.height
    if (ourLatestBlock.height === lastBlockHeight) {
      log('<< Block is not updaed yet >>', lastBlockHeight)
      return res.json(null)
    }

    const { data: block } = await axios.get(`${btcSingleblockUrl}/${lastBlockHeight}`)
    const addressSnapshot = await getColData('bitcoin_address')
    const addressData = {}
    addressSnapshot.forEach(s => {
      addressData[s.id] = s.data()
    })
    const batch = db.batch()
    const editedAddress = checkTxs(block, addressData, db, batch)

    const blockTime = data.time
    latestBlockRef = db.collection('bitcoin_block').doc('latest')
    prevBlockRef = db.collection('bitcoin_block').doc('prev')
    batch.set(latestBlockRef, {
      height: lastBlockHeight, time: blockTime,
      time_to_create: blockTime - ourLatestBlock.time
    })
    batch.set(prevBlockRef, ourLatestBlock)

    await deleteOverAWeekOldTxs(batch)

    const objKeys = Object.keys(editedAddress)
    if (objKeys.length === 0) {
      log('|| check complete without commit ||')
      return res.json(null)
    }

    for (const addr of objKeys) {
      ref = db.collection('bitcoin_address').doc(addr)
      batch.set(ref, editedAddress[addr])
    }
    await batch.commit()
    log('** check compelete with commit **', objKeys)
    return res.json(objKeys)
  } catch (e) {
    log(e)
  }
}

async function checkTxs (block, address, db, batch) {
  const editedAddress = {}
  block.tx.map(t => {
    const beforeObjKeys = Object.keys(editedAddress)
    t.inputs.map(input => {
      if (input.prev_out.addr) {
        const addr = input.prev_out.addr
        if (address[addr]) {
          if (!editedAddress[addr]) {
            editedAddress[addr] = address[addr]
          }
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
    const afterObjKeys = Object.keys(editedAddress)
    if (beforeObjKeys.length !== afterObjKeys.length) {
      ref = db.collection('bitcoin_address_tx').doc(t.hash)
      batch.set(ref, t)
    }
  })
  return editedAddress
}
