
let config = {}

config.elasticsearch = {
  host: 'localhost:9200',
  playgroundIndex: 'playground_index',
  playgroundType: 'playground_type'
}
// config.elasticsearch = {
//   host: 'localhost:9200',
//   polygonsIndex: 'playground_index',
//   polygonsType: 'playground_type'
// }

module.exports = config
