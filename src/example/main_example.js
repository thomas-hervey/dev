const config = require('./config_example')
const esHelper = require('../es-helper')
const mapping = require('./mapping_example.json')
const recursive = require('recursive-readdir')
const fs = require('fs')
const simplify = require('simplify-geojson')
const sleep = require('sleep')
const util = require('util')

let filePath = '/Users/thom9230/Projects/polygons/dev/src/example/85632217_example.geojson'
let currentFile = JSON.parse(fs.readFileSync(filePath, 'utf8')) // load .geojson as json object

let feature = constructFeature(currentFile)

feature = simplify(feature, 0.01) // simplify geometry
// console.log(simplifiedFeature.geometry.coordinates)

const output = '/Users/thom9230/Projects/polygons/dev/src/example/output.geojson'
fs.writeFileSync(output, JSON.stringify(feature) , 'utf-8')

esHelper.pushIntoIndex(
  config.elasticsearch.playgroundIndex,
  config.elasticsearch.playgroundType,
  feature,
  feature.id)
  .then(() => { console.log('Indexed: ' + feature.id) })
  .catch(e => { console.log(e) })


function constructFeature(file) {
  const { properties, id, type, bbox, geometry } = file
  return {
    id: id || 0,
    type: type || "",
    properties: {
      name: properties["wof:name"] || "",
      nameVariants: properties["name:eng_x_variant"] || "",
      placeType: properties["wof:placetype"] || "",
      hierarchy: properties["wof:hierarchy"] || 88888,
      belongsTo: properties["wof:belongsto"] || 99999,
      parentID: properties["wof:parent_id"] || 99999,
      children: properties["wof:belongsto"] || "",
      source: {
        srcGeom: properties["src:geom"] || "",
        srcGeomAlt: properties["src:geom_alt"] || "",
        concordances: properties["wof:concordances"] || ""
      }
    },
    bbox: bbox || 77777,
    geometry: geometry || 0,
  }
}

// const example = require('./85632179.geojson')
// esHelper.pushIntoIndex(config.elasticsearch.polygonsIndex, config.elasticsearch.polygonsType, example, example.id)
// .then(() => { console.log('Indexed') })
// .catch(e => { console.log(e) })


// curl XGET /attractions/landmark/_search
// {
//   "query": {
//     "geo_shape": {
//       "geometry": {
//         "shape": {
//           "type":   "circle",
//           "radius": "100km",
//           "coordinates": [
//             -77.23388671874999, 38.77978137804918
//           ]
//         }
//       }
//     }
//   }
// }
