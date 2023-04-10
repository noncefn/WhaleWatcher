const axios = require('axios')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const { aWeekAgo } = require('./src/utils/time')
const serviceAccount = require('./whalewatcher_cert.json')
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

const url = 'https://blockchain.info/rawaddr/bc1qjh0akslml59uuczddqu0y4p3vj64hg5mc94c40'

const blockUrl = 'https://blockchain.info/rawblock/784645'

async function main() {
  const txRef = db.collection('bitcoin_address_tx')
  const overAWeekOldTxsRes = await txRef.where('time', '<', aWeekAgo()).get()
  const batch = db.batch()
  if (overAWeekOldTxsRes.size === 0) {
    console.log('tests')
  }
  overAWeekOldTxsRes.forEach(t => {
    // if (t.data().time < aWeekAgoTime) {
      
    // }
  })
  await batch.commit()

  
}

main()

