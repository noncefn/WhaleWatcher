exports.getColData = async function getColData (col, db) {
  const snapshot = await db
    .collection(col)
    .get()
  const address = {}
  snapshot.forEach(s => {
    address[s.id] = s.data()
  })
  return address
}

exports.getDocData = async function getDocData (col, doc, db) {
  const snapshot = await db
    .collection(col)
    .doc(doc)
    .get()
  return snapshot.data()
}
