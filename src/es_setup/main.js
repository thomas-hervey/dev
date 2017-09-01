const config = require('./config')
const esHelper = require('./es-helper')
const fs = require('fs')
const simplify = require('simplify-geojson')
const sleep = require('sleep')
const centroid = require('@turf/centroid')
const area = require('@turf/area')

let filePath = process.argv[2] // pull off file path from shell command
let currentFile = JSON.parse(fs.readFileSync(filePath, 'utf8')) // load .geojson as json object

const feature = constructFeature(currentFile)

// const simplifiedFeature = simplify(feature, 0.01) // simplify geometry

let bulk = []
bulk.push({
      index: {
        _index: config.elasticsearch.polygonsIndex,
        _type: config.elasticsearch.polygonsType,
        _id: feature.id
      }
    })
    bulk.push(feature)

esHelper.bulkIndex(bulk)
.then((response) => {
        // console.log(JSON.stringify(response, null, 2))
        console.log('Indexed: ' + feature.id) })
  .catch(e => { console.log(e) })

// esHelper.pushIntoIndex(
//   config.elasticsearch.polygonsIndex,
//   config.elasticsearch.polygonsType,
//   feature,
//   feature.id)
//   .then(() => { console.log('Indexed: ' + feature.id) })
//   .catch(e => { console.log(e) })


function constructFeature(file) {
  return {
    id: file.id || 0,
    type: file.type || "",
    properties: {
      name: file.properties["wof:name"] || "",
      nameVariants: file.properties["name:eng_x_variant"] || "",
      placeType: file.properties["wof:placetype"] || "",
      hierarchy: file.properties["wof:hierarchy"] || 88888,
      belongsTo: file.properties["wof:belongsto"] || 99999,
      parentID: file.properties["wof:parent_id"] || 99999,
      children: file.properties["wof:belongsto"] || "",
      center: centroid(file).geometry.coordinates,
      area: area(file),
      source: {
        srcGeom: file.properties["src:geom"] || "",
        srcGeomAlt: file.properties["src:geom_alt"] || "",
        concordances: file.properties["wof:concordances"] || {}
      }
    },
    bbox: file.bbox || 77777,
    geometry: file.geometry || 0,
  }
}

// createFeatureFromGeometry (geometry) {
//   const feature = turf.
//   var geometry = {
//   "type": "Point",
//   "coordinates": [110, 50]
// };

// var feature = turf.feature(geometry);
//}

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
