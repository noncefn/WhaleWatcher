exports.aWeekAgo = function aWeekAgo () {
  return Math.floor(Date.now() / 1000) - 604800
}

exports.unixTimestamp = function aWeekAgo () {
  return Math.floor(Date.now() / 1000)
}
