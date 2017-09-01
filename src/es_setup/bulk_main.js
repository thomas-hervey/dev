const config = require('./config')
const esHelper = require('./es-helper')
const fs = require('fs')


const testFolder = '~/es/copy/polygons/sources/MZ/common_optional/county';

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
}


// let all_paths = process.argv[2] // pull off file path from shell command

// for(path = 0, path = all_paths.length, i++) {
//   console.log(path)
//   // let currentFile = JSON.parse(fs.readFileSync(filePath, 'utf8')) // load .geojson as json object
//   // const feature = constructFeature(currentFile)
//   // esHelper.bulkIndex()
// }


// const simplifiedFeature = simplify(feature, 0.01) // simplify geometry

// esHelper.bulk(
//   config.elasticsearch.polygonsIndex,
//   config.elasticsearch.polygonsType,
//   feature,
//   feature.id)
//   .then(() => { console.log('Indexed: ' + feature.id) })
//   .catch(e => { console.log(e) })


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
        concordances: properties["wof:concordances"] || {}
      }
    },
    bbox: bbox || 77777,
    geometry: geometry || 0,
  }
}
