const axios = require('axios')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const serviceAccount = require('./whalewatcher_cert.json')
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

const richAddresses20 = [
  '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo',
  'bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97',
  '3JJmF63ifcamPLiAmLgG96RA599yNtY3EQ',
  '1LQoWist8KkaUXSPKZHNvEyfrEkPHzSsCd',
  'bc1qazcm763858nkj2dj986etajv6wquslv8uxwczt',
  '37XuVSEpWW4trkfmvWzegTHQt7BdktSKUs',
  '1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF',
  'bc1qa5wkgaew2dkv56kfvj49j0av5nml45x9ek9hz6',
  '3LYJfcfHPXYJreMsASk2jkn69LWEYKzexb',
  'bc1qd4ysezhmypwty5dnw7c8nqy5h5nxg0xqsvaefd0qn5kq32vwnwqqgv4rzr',
  'bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h',
  '1LdRcdxfbSnmCYYNdeYpUnztiYzVfBEQeC',
  '1AC4fMwgY8j9onSbXEWeH6Zan8QGMSdmtA',
  '1LruNZjwamWJXThX2Y8C2d47QqhAkkc5os',
  '3M219KR5vEneNb47ewrPfWyb5jQ2DjxRP6',
  '3LCGsSmfr24demGvriN4e3ft8wEcDuHFqh',
  '3LQUu4v9z6KNch71j7kbj8GPeAGUo1FW6a',
  'bc1qjasf9z3h7w3jspkhtgatgpyvvzgpa2wwd2lr0eh5tx44reyn2k7sfc27a4',
  'bc1q7ydrtdn8z62xhslqyqtyt38mm4e2c4h3mxjkug',
  'bc1qjh0akslml59uuczddqu0y4p3vj64hg5mc94c40',
]

const richAddresses40 = [
  '12XqeqZRVkBDgmPLVY4ZC6Y4ruUUEug8Fx',
  'bc1qx9t2l3pyny2spqpqlye8svce70nppwtaxwdrp4',
  '3FHNBLobJnbCTFTVakh5TXmEneyf5PT61B',
  '12ib7dApVFvg82TXKycWBNpN8kFyiAN1dr',
  'bc1qf2yvj48mzkj7uf8lc2a9sa7w983qe256l5c8fs',
  '12tkqA9xSoowkzoERHMWNKsTey55YEBqkv',
  '38UmuUqPCrFmQo4khkomQwZ4VbY2nZMJ67',
  '1aXzEKiDJKzkPxTZy9zGc3y1nCDwDPub2',
  '17MWdxfjPYP2PYhdy885QtihfbW181r1rn',
  'bc1qjysjfd9t9aspttpjqzv68k0ydpe7pvyd5vlyn37868473lell5tqkz456m',
  '19D5J8c59P2bAkWKvxSYw8scD3KUNWoZ1C',
  '3FupZp77ySr7jwoLYEJ9mwzJpvoNBXsBnE',
  '19N9sDbJ7MDQcPFSjPNqjNDzyRNbNsQ6Zv',
  '1932eKraQ3Ad9MeNBHb14WFQbNrLaKeEpT',
  'bc1qcdeadk07jkthules0yw9u9ue9pklvr608ez94jgwcf7h2ldzcg6qwxp9er',
  '1m5SViB9XNwsusvnnUqpfL9Q1E5EZxPHs',
  '3LoAAJN3tbMCEXWjGNeiyG2TtzLJYXcG5R',
  '17rm2dvb439dZqyMe2d4D6AQJSgg6yeNRn',
  '15cHRgVrGKz7qp2JL2N5mkB2MCFGLcnHxv',
  'bc1quhruqrghgcca950rvhtrg7cpd7u8k6svpzgzmrjy8xyukacl5lkq0r8l2d',
]


async function main() {
  let count = 0
  setInterval(async () => {
    try {
      console.log(`Start to mine ${richAddresses40[count]} address ${count}`)
      const address = richAddresses40[count]
      const { data } = await axios.get(`https://blockchain.info/rawaddr/${address}`)
      const editedAddress = checkTxs(data)
      delete editedAddress.txs
      console.log(editedAddress.week_balance)
      const batch = db.batch();
      const ref = db.collection('bitcoin_address').doc(address)
      batch.set(ref, editedAddress)
      const res = await batch.commit()
      console.log(res)
      count++
    } catch (e) {
      console.log(e)
    }
  }, 10000)
}

main()

function checkTxs(address) {
  const aWeekAgo = Math.floor(Date.now() / 1000) - 604800
  address.week_balance = 0
  address.txs.map(t => {
    if (t.time > aWeekAgo) {   
      t.inputs.map(input => {
        if (input.prev_out.addr) {
          const addr = input.prev_out.addr
          if (address.address === addr) {
            address.week_balance -= input.prev_out.value
          }
        }
      })
      t.out.map(utxo => {
        if (utxo.addr) {
          const addr = utxo.addr
          if (address.address === addr) {
            address.week_balance += utxo.value
          }
        }
      })
    }
  })
  return address
}
