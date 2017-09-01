var elasticsearch = require('elasticsearch')

var client = new elasticsearch.Client({
  host: 'localhost:9201'
})

module.exports = client
