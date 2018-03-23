module.exports = npm1k

const concatSeries = require('async.concatseries')
const https = require('https')
const uniq = require('array-uniq')

function getOffsets(limit) {
  const offsets = []
  for (let i = 0; i <= limit; i += 36) {
    offsets.push(i)
  }
  return offsets
}

function npm1k(callback, limit = 1050) {
  const offsets = getOffsets(limit)
  concatSeries(
    offsets,
    (offset, callback) => {
      getMostDependedPage(offset, (error, data) => {
        if (error) {
          callback(error) }
        else {
          callback(null, packageNames(data)) } }) },
          (error, packages) => {
      if (error) {
        callback(error) }
      else {
        callback(null, uniq(packages).slice(0, 1000)) } }) }

function packageNames(data) {
  const parsed = JSON.parse(data)
  return parsed.packages.map(pkg => pkg.name)
}

function getMostDependedPage(offset, callback) {
  https.get(
    { hostname: 'www.npmjs.com',
      path: '/browse/depended?offset=' + offset,
      headers: { 'x-spiferack': 1 }
    },
    (response) => {
      const buffers = []
      response
        .on('data', (buffer) => {
          buffers.push(buffer) })
        .on('error', (error) => {
          callback(error) })
        .on('end', () => {
          callback(null, Buffer.concat(buffers).toString()) }) }) }
