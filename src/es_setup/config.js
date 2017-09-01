
let config = {}

config.elasticsearch = {
  host: 'localhost:9201',
  polygonsIndex: 'polygons_index',
  polygonsType: 'polygons_type'
}
// config.elasticsearch = {
//   host: 'localhost:9200',
//   polygonsIndex: 'playground_index',
//   polygonsType: 'playground_type'
// }

module.exports = config
