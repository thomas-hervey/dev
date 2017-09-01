const config = require('./config')
const esHelper = require('./es-helper')
const mapping = require('./new_mapping.json').mappings

return esHelper
    .putMapping({
      index: config.elasticsearch.polygonsIndex,
      type: config.elasticsearch.polygonsType,
      body: mapping
    })
    .then(resp => {
      console.log('Mapping result: ', resp)
    })
    .catch(e => {
      console.log(e)
    })
