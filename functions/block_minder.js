const axios = require('axios')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const serviceAccount = require('./whalewatcher_cert.json')
initializeApp({
  credential: cert(serviceAccount)
})
const db = getFirestore();

let blockHeight = 150000
const getBlockUrl = `https://blockchain.info/rawblock/${blockHeight}`
const getLatestBlockUrl = `https://blockchain.info/latestblock`
// const getAddress = `https://blockchain.info/rawaddr/${address}`


async function setAddressData (address, data) {
  return await db
    .collection('bitcoin_address')
    .doc(address)
    .set(data)
}

async function getAddressData () {
    const snapshot = await db
      .collection('bitcoin_address')
      .get()
    const address = {}
    snapshot.forEach(s => {
      address[s.id] = s.data()
    })
    return address
}

// const block = {
//   tx: [
//     {
//       inputs: [{
//         prev_out: { addr: '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo', value: 1000 },
//       }],
//       out: [
//         { addr: '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo', value: 500 },
//         { addr: '3JJmF63ifcamPLiAmLgG96RA599yNtY3EQ', value: 500 },
//       ]
//     }
//   ]
// }

async function main() {
  try {
    const { data } = await axios.get(getLatestBlockUrl)
    blockHeight = data.height
    const { data: block } = await axios.get(`https://blockchain.info/rawblock/${blockHeight}`)
    const address = await getAddressData()
    const editedAddress = checkTxs(address, block)
    const objKeys = Object.keys(editedAddress)
    if (objKeys.length === 0) {
      console.log('check complete without commit')
      return null
    }

    const batch = db.batch();
    for (const addr of objKeys) {
      console.log(addr)
      ref = db.collection('bitcoin_address').doc(addr)
      batch.set(ref, editedAddress[addr])
    }
    await batch.commit()
    console.log('check compelete', objKeys)
  } catch (e) {
    console.log(e)
  }
}

main()

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
