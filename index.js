module.exports = npm1k

const requestRetry = require('requestretry').defaults({ json: true, maxAttempts: 3, fullResponse: false })

function npm1k(callback, limit = 1000) {
  process(limit)
    .then(names => callback(null, names))
    .catch(error => callback(error))
}

async function process(limit) {
  let names = []
  for (let offset = 0; offset < limit; offset += 36) {
    const response = await requestRetry.get(`https://www.npmjs.com/browse/depended?offset=${offset}`, {
      headers: { 'x-spiferack': 1 }
    })
    const namesPage = response.packages.map(pkg => pkg.name)
    names = names.concat(namesPage)
  }
  return names.slice(0, limit)
}
