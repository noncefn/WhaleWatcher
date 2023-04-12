const axios = require('axios')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const serviceAccount = require('./whalewatcher_cert.json')
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

const richAddresses20 = [
  {addr: '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo', exchange: 'Binance'},
  {addr: 'bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97', exchange: 'Bitfinex'},
  {addr: '3JJmF63ifcamPLiAmLgG96RA599yNtY3EQ'},
  {addr: '1LQoWist8KkaUXSPKZHNvEyfrEkPHzSsCd'},
  {addr: 'bc1qazcm763858nkj2dj986etajv6wquslv8uxwczt'},
  {addr: '37XuVSEpWW4trkfmvWzegTHQt7BdktSKUs'},
  {addr: '1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF'},
  {addr: 'bc1qa5wkgaew2dkv56kfvj49j0av5nml45x9ek9hz6'},
  {addr: '3LYJfcfHPXYJreMsASk2jkn69LWEYKzexb', exchange: 'Binance'},
  {addr: 'bc1qd4ysezhmypwty5dnw7c8nqy5h5nxg0xqsvaefd0qn5kq32vwnwqqgv4rzr'},
  {addr: 'bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h', exchange: 'Binance'},
  {addr: '1LdRcdxfbSnmCYYNdeYpUnztiYzVfBEQeC'},
  {addr: '1AC4fMwgY8j9onSbXEWeH6Zan8QGMSdmtA'},
  {addr: '1LruNZjwamWJXThX2Y8C2d47QqhAkkc5os'},
  {addr: '3M219KR5vEneNb47ewrPfWyb5jQ2DjxRP6', exchange: 'Binance'},
  {addr: '3LCGsSmfr24demGvriN4e3ft8wEcDuHFqh', exchange: 'Coincheck'},
  {addr: '3LQUu4v9z6KNch71j7kbj8GPeAGUo1FW6a'},
  {addr: 'bc1qjasf9z3h7w3jspkhtgatgpyvvzgpa2wwd2lr0eh5tx44reyn2k7sfc27a4'},
  {addr: 'bc1q7ydrtdn8z62xhslqyqtyt38mm4e2c4h3mxjkug'},
  {addr: 'bc1qjh0akslml59uuczddqu0y4p3vj64hg5mc94c40'},
  {addr: '12XqeqZRVkBDgmPLVY4ZC6Y4ruUUEug8Fx'},
  {addr: 'bc1qx9t2l3pyny2spqpqlye8svce70nppwtaxwdrp4'},
  {addr: '3FHNBLobJnbCTFTVakh5TXmEneyf5PT61B'},
  {addr: '12ib7dApVFvg82TXKycWBNpN8kFyiAN1dr'},
  {addr: 'bc1qf2yvj48mzkj7uf8lc2a9sa7w983qe256l5c8fs'},
  {addr: '12tkqA9xSoowkzoERHMWNKsTey55YEBqkv'},
  {addr: '38UmuUqPCrFmQo4khkomQwZ4VbY2nZMJ67', exchange: 'OKX(OKEx)'},
  {addr: '1aXzEKiDJKzkPxTZy9zGc3y1nCDwDPub2'},
  {addr: '17MWdxfjPYP2PYhdy885QtihfbW181r1rn'},
  {addr: 'bc1qjysjfd9t9aspttpjqzv68k0ydpe7pvyd5vlyn37868473lell5tqkz456m', exchange: 'Bybit'},
  {addr: '19D5J8c59P2bAkWKvxSYw8scD3KUNWoZ1C'},
  {addr: '3FupZp77ySr7jwoLYEJ9mwzJpvoNBXsBnE', exchange: 'OKX(OKEx)'},
  {addr: '19N9sDbJ7MDQcPFSjPNqjNDzyRNbNsQ6Zv'},
  {addr: '1932eKraQ3Ad9MeNBHb14WFQbNrLaKeEpT'},
  {addr: 'bc1qcdeadk07jkthules0yw9u9ue9pklvr608ez94jgwcf7h2ldzcg6qwxp9er'},
  {addr: '1m5SViB9XNwsusvnnUqpfL9Q1E5EZxPHs'},
  {addr: '3LoAAJN3tbMCEXWjGNeiyG2TtzLJYXcG5R'},
  {addr: '17rm2dvb439dZqyMe2d4D6AQJSgg6yeNRn'},
  {addr: '15cHRgVrGKz7qp2JL2N5mkB2MCFGLcnHxv'},
  {addr: 'bc1quhruqrghgcca950rvhtrg7cpd7u8k6svpzgzmrjy8xyukacl5lkq0r8l2d', exchange: 'OKX(OKEx)'},
  {addr: '385cR5DM96n1HvBDMzLHPYcw89fZAXULJP', exchange: 'Bittrex'},
  {addr: '3H5JTt42K7RmZtromfTSefcMEFMMe18pMD', exchange: 'Poloniex'},
  {addr: '3Kzh9qAqVWQhEsfQz7zEQL1EuSx5tyNLNS', exchange: 'OKX(OKEx)'},
  {addr: '3BMEXqGpG4FxBA1KWhRFufXfSTRgzfDBhJ', exchange: 'BitMEX'},
  {addr: '3JZq4atUahhuA9rLhXLMhhTo133J9rF97j', exchange: 'Bitfinex'},
  {addr: 'bc1q080rkmk3kj86pxvf5nkxecdrw6nrx3zzy9xl7q', exchange: 'Kucoin'},
  {addr: '14m3sd9HCCFJW4LymahJCKMabAxTK4DAqW', exchange: 'Crypto.com'},
]

richAddress40 = [
]

async function main() {
  let count = 0
  setInterval(async () => {
    if (count === 48) {
      console.log('done!')
      return
    }
    try {
      console.log(`Start to mine ${richAddresses20[count].addr} address ${count}`)
      const address = richAddresses20[count].addr
      const { data } = await axios.get(`https://blockchain.info/rawaddr/${address}`)

      const batch = db.batch()
      checkTxs(data, batch)

      if (richAddresses20[count].exchange) {
        data.exchange = richAddresses20[count].exchange
      }
      delete data.txs
      const ref = db.collection('bitcoin_address').doc(address)
      batch.set(ref, data)
      const res = await batch.commit()
      count++
    } catch (e) {
      console.log(e)
    }
  }, 10000)
}

main()

function checkTxs(address, batch) {
  const aWeekAgo = Math.floor(Date.now() / 1000) - 604800
  address.txs.map(t => {
    if (t.time > aWeekAgo) {
      const ref = db.collection('bitcoin_address_tx').doc(t.hash)
      batch.set(ref, t)
      console.log(`tx hash: ${t.hash} inserted`)
    }
  })
}
