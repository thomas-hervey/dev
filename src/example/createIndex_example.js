const config = require('./config_example')
const esHelper = require('../es-helper')
const mapping = require('./mapping_example.json').mappings
const recursive = require('recursive-readdir')
const fs = require('fs')
const simplify = require('simplify-geojson')
const sleep = require('sleep')

esHelper
  .createIndexIfNotExists(config.elasticsearch.playgroundIndex)
  .then(r => {
    console.log('response: ' + r)
    return esHelper
      .putMapping({
        index: config.elasticsearch.playgroundIndex,
        type: config.elasticsearch.playgroundType,
        body: mapping
      })
      .catch(e => {
        console.log(e)
      })
  })


  // {
  //   properties: {
  //     'geometry': {
  //       'type': 'geo_shape'
  //     }
  //   }
  // }
  //
  // 'id': { 'type': 'integer' },
  // 'type': { 'type': 'string' },
  //
  // 'tree': 'geohash',
  // 'precision': '500m'
  //
  // 'properties': {
  //   'type': 'nested',
  //   properties: {
  //     'name:*': {
  //       'type': 'string',
  //       'index': 'not_analyzed'
  //     }
  //   }
  // },

// // from mapping.json
// "id": { "type": "int" },
// "type": { "type": "string" },
// "properties": {
//   "type": { },
//   "name:*": { "type": "string", "index": "not_analyzed" }
// },
