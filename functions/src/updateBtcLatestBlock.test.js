const { getDocData, getColData, deleteOverAWeekOldTxs } = require('./utils/db')
const functions = require("firebase-functions")
const admin = require('firebase-admin')
const axios = require('axios')

const btcLatestBlockUrl = `https://blockchain.info/latestblock`
const btcSingleblockUrl = `https://blockchain.info/rawblock`
const log = functions.logger.log

const testBlockData = {
  "hash": "000000000000000000046015227342836b839e15864e508de3c19dcc5ed2ef65",
  "ver": 536879104,
  "prev_block": "00000000000000000000456a4c4170520ec4e463c49ad848450cb78ccdb06022",
  "mrkl_root": "73eeafa064327a93338b4f4464ac2edd3c3ac4b09efa657463594a355886a8c0",
  "time": 1681471662,
  "bits": 386261170,
  "next_block": [
    "0000000000000000000440efd88cd190ac92b5cbaa6d04cc85fc0b36d4698280"
  ],
  "fee": 14029716,
  "nonce": 4080019519,
  "n_tx": 1409,
  "size": 1348066,
  "block_index": 785356,
  "main_chain": true,
  "height": 785356,
  "weight": 3993325,
  "tx": [
    {
      "hash": "01893a7b82ef500b11012f95091e0ecedc63f9dea0f47c3f80c679bc60013a3b",
      "ver": 1,
      "vin_sz": 1,
      "vout_sz": 3,
      "size": 299,
      "weight": 1088,
      "fee": 0,
      "relayed_by": "0.0.0.0",
      "lock_time": 0,
      "tx_index": 2083850152283960,
      "double_spend": false,
      "time": 1681471662,
      "block_index": 785356,
      "block_height": 785356,
      "inputs": [
        {
          "sequence": 4294967295,
          "witness": "01200000000000000000000000000000000000000000000000000000000000000000",
          "script": "03ccfb0b14656d63642e696f313030377500c600d01dadba01fabe6d6d036ad179a27169d7537585a96b00959acb34ad56ab2d87f4f59100bb94255a12040000000000000000002134dd58040000000000",
          "index": 0,
          "prev_out": {
            "n": 4294967295,
            "script": "",
            "spending_outpoints": [
              {
                "n": 0,
                "tx_index": 2083850152283960
              }
            ],
            "spent": true,
            "tx_index": 0,
            "type": 0,
            "value": 0
          }
        }
      ],
      "out": [
        {
          "type": 0,
          "spent": false,
          "value": 639029716,
          "spending_outpoints": [
            
          ],
          "n": 0,
          "tx_index": 2083850152283960,
          "script": "a914d33646c72b9b02fa00e8082fc0136253e02dcacd87",
          "addr": "3LwoXDToPiq2rBaQzoe2ZnaUvhGykFp2LM"
        },
        {
          "type": 0,
          "spent": false,
          "value": 0,
          "spending_outpoints": [
            
          ],
          "n": 1,
          "tx_index": 2083850152283960,
          "script": "6a24aa21a9ede9c87b3fbecf182a12b58c470b08a9adb1573d05af6cb663920bccfeb4120dd1"
        },
        {
          "type": 0,
          "spent": false,
          "value": 0,
          "spending_outpoints": [
            
          ],
          "n": 2,
          "tx_index": 2083850152283960,
          "script": "6a2952534b424c4f434b3a70f6d424536d97b04bafbad4f4975a65d58e253156cf1a2e3df3a929004f9208"
        }
      ]
    },
    {
      "hash": "26d3ae74fb954ddc6b8a8bc6398a800e7f3d28ef0be8f07c189706bea917ac5e",
      "ver": 1,
      "vin_sz": 1,
      "vout_sz": 2,
      "size": 223,
      "weight": 565,
      "fee": 14484,
      "relayed_by": "0.0.0.0",
      "lock_time": 0,
      "tx_index": 3330983180353746,
      "double_spend": false,
      "time": 1681471697,
      "block_index": 785356,
      "block_height": 785356,
      "inputs": [
        {
          "sequence": 4294967295,
          "witness": "024730440220240e5ba930ab4498db22394c41421eeb6fb8983ed7a98945da206be42383d717022037d4bc5978b4c233711915be51074ef5cadf578d442a94810e319c31410ec242012103720ced6802315e01d68b846a4f94ae1140eec47387c92f62f3ed8ae284f1f401",
          "script": "",
          "index": 0,
          "prev_out": {
            "addr": "bc1q3ypz8829gs4jqzhjwh5qmq8eppam655sezu942",
            "n": 3,
            "script": "00148902239d45442b200af275e80d80f9087bbd5290",
            "spending_outpoints": [
              {
                "n": 0,
                "tx_index": 3330983180353746
              }
            ],
            "spent": true,
            "tx_index": 5923152992816940,
            "type": 0,
            "value": 300000
          }
        }
      ],
      "out": [
        {
          "type": 0,
          "spent": false,
          "value": 92000,
          "spending_outpoints": [
            
          ],
          "n": 0,
          "tx_index": 3330983180353746,
          "script": "a914acedc5fde9153ec2351493a3473304343395e09587",
          "addr": "3HTNzKmfDfuwvJ3ZBaVx7D4tJjfKkZpYFM"
        },
        {
          "type": 0,
          "spent": true,
          "value": 193516,
          "spending_outpoints": [
            {
              "tx_index": 2141771892345365,
              "n": 0
            }
          ],
          "n": 1,
          "tx_index": 3330983180353746,
          "script": "00148902239d45442b200af275e80d80f9087bbd5290",
          "addr": "bc1q3ypz8829gs4jqzhjwh5qmq8eppam655sezu942",
        }
      ]
    }
  ]
}

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

