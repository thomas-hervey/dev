const config = require('./config')
const esHelper = require('./es-helper')

const client = new elasticsearch.Client({
  host: config.elasticsearch.host
})

client.snapshot.createRepository()
// TODO: complete this command
