```javascript
var npm1k = require('npm1k')
var assert = require('assert')

npm1k(function(error, packages) {

  assert.equal(packages.length, 1000)

  assert(packages.every(function(element) {
    return ( typeof element === 'string' ) }))

  assert(packages.indexOf('semver') > -1) })
```
