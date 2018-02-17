module.exports = npm1k

var cheerio = require('cheerio')
var concatSeries = require('async.concatseries')
var https = require('https')
var uniq = require('array-uniq')

function getOffsets(limit) {
  var offsets = [ ]
  for (var i = 0; i <= limit; i += 36) {
    offsets.push(i) }
  return offsets
}

function npm1k(callback, limit = 1050) {
  var offsets = getOffsets(limit)
  concatSeries(
    offsets,
    function(offset, callback) {
      getMostDependedPage(offset, function(error, html) {
        if (error) {
          callback(error) }
        else {
          callback(null, packageNames(html)) } }) },
    function(error, packages) {
      if (error) {
        callback(error) }
      else {
        callback(null, uniq(packages).slice(0, 1000)) } }) }

function packageNames(html) {
  var $ = cheerio.load(html)
  return $('a.name')
    .map(function() {
      return cheerio(this).text() })
    .get() }

function getMostDependedPage(offset, callback) {
  https.get(
    { hostname: 'www.npmjs.com',
      path: '/browse/depended?offset=' + offset },
    function(response) {
      var buffers = [ ]
      response
        .on('data', function(buffer) {
          buffers.push(buffer) })
        .on('error', function(error) {
          callback(error) })
        .on('end', function() {
          callback(null, Buffer.concat(buffers).toString()) }) }) }
