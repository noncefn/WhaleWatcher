const axios = require('axios')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const serviceAccount = require('./whalewatcher_cert.json')
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

const richAddresses = [
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

async function setAddressData (address, data) {
  const batch = db.batch();
  const ref = db.collection('bitcoin_address').doc(address)
  batch.set(ref, {address: data})
  return await batch.commit()
}

async function main() {
  let count = 0
  setInterval(async () => {
    try {
      console.log(count)
      const address = richAddresses[count]
      const { data } = await axios.get(`https://blockchain.info/rawaddr/${address}`)
      const aWeekAgo = Math.floor(Date.now() / 1000) - 604800
      data.txs.map(t => {
        if (t.time > aWeekAgo) {
          
        }
      })
      const res = await setAddressData(address, data)
      console.log(res)
      count++
    } catch (e) {
      console.log(e.response.statusText)
    }
  }, 10000)
}

main()
