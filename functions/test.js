const axios = require('axios')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const serviceAccount = require('./whalewatcher_cert.json')
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

const url = 'https://blockchain.info/rawaddr/bc1qjh0akslml59uuczddqu0y4p3vj64hg5mc94c40'

const blockUrl = 'https://blockchain.info/rawblock/784645'

async function main() {
  // const aWeekAgo = Math.floor(Date.now() / 1000) - 604800
  // const time = 1679599756
  // if (aWeekAgo < time) {
  //   console.log('more than a week')
  // }
  // const { data } = await axios.get(url)
  // let totalUse = 0
  // let totalSpent = 0
  // data.txs.map(t => {
  //   t.inputs.map(input => {
  //     totalUse += input.prev_out.value
  //   })
  //   t.out.map(out => {
  //     totalSpent += out.value
  //   })
  //   console.log('inputs', totalUse)
  //   console.log('outputs + fee', totalSpent + t.fee)
  //   totalUse = 0
  //   totalSpent = 0
  // })
  const test = {a: 1, b: 2}
  if (!test['c']) {
    console.log(123)
  }
}

main()

