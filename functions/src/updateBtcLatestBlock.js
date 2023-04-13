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
      log('<< Block is not updated yet >>', lastBlockHeight)
      return
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
    blockRef = db.collection('bitcoin_block').doc(block.height.toString())
    batch.set(latestBlockRef, {
      height: lastBlockHeight, time: blockTime,
      time_to_create: blockTime - ourLatestBlock.time
    })
    batch.set(prevBlockRef, ourLatestBlock)
    batch.set(blockRef, block)

    await deleteOverAWeekOldTxs(batch)

    const objKeys = Object.keys(editedAddress)
    if (objKeys.length === 0) {
      await batch.commit()
      log('|| check complete without commit ||')
      return
    }

    for (const addr of objKeys) {
      ref = db.collection('bitcoin_address').doc(addr)
      batch.set(ref, editedAddress[addr])
    }
    await batch.commit()
    log('** check compelete with commit **', objKeys)
    return
  } catch (e) {
    log(e)
  }
}

async function checkTxs (block, address, db, batch) {
  let totalVolume = 0
  let totalSelfVolume = 0
  let totalExchangeBalance = 0
  let totalExchangeVolume = 0
  const editedAddress = {}
  block.tx.map(t => {
    const inputsAddress = []
    const beforeObjKeys = Object.keys(editedAddress)
    t.inputs.map(input => {
      if (input.prev_out.addr) {
        const addr = input.prev_out.addr
        inputsAddress.push(addr)
        totalVolume += input.prev_out.value
        if (address[addr]) {
          const addressData = address[addr]
          const inputValue = input.prev_out.value
          if (addressData.exchange) {
            totalExchangeVolume += inputValue
            totalExchangeBalance -= inputValue
          }
          if (!editedAddress[addr]) {
            editedAddress[addr] = addressData
          }
          editedAddress[addr].total_sent += inputValue
          editedAddress[addr].final_balance -= inputValue
        }
      }
    })
    t.out.map(utxo => {
      if (utxo.addr) {
        const addr = utxo.addr
        inputsAddress.map(address => {
          if (address === addr) {
            totalVolume -= utxo.value
            totalSelfVolume += utxo.value
          }
        })
        if (address[addr]) {
          const addressData = address[addr]
          const utxoValue = utxo.value
          if (addressData.exchange) {
            totalExchangeVolume -= utxoValue
            totalExchangeBalance += utxoValue
          }
          if (!editedAddress[addr]) {
            editedAddress[addr] = addressData
          }
          editedAddress[addr].total_received += utxoValue
          editedAddress[addr].final_balance += utxoValue
        }
      }
    })
    const afterObjKeys = Object.keys(editedAddress)
    if (beforeObjKeys.length !== afterObjKeys.length) {
      ref = db.collection('bitcoin_address_tx').doc(t.hash)
      batch.set(ref, t)
    }
  })
  block.total_self_volume = totalSelfVolume
  block.total_exchange_volume = totalExchangeVolume
  block.total_exchange_balance = totalExchangeBalance
  block.total_volume = totalVolume
  delete block.tx
  return editedAddress
}
