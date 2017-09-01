const config = require('./config')
const esHelper = require('./es-helper')
const mapping = require('./mapping.json')
const recursive = require('recursive-readdir')
const fs = require('fs')
const simplify = require('simplify-geojson')
const sleep = require('sleep')

esHelper
  .createIndexIfNotExists(config.elasticsearch.polygonsIndex)
  .then(r => {
    console.log('response: ' + r)
    return esHelper
      .putMapping({
        index: config.elasticsearch.polygonsIndex,
        type: config.elasticsearch.polygonsType,
        body: mapping // let's try the dataset mapping for both consolidatedMappingBody
      })
      .catch(e => {
        console.log(e)
      })
  })
  .then(() => {
    const basePath = '/Users/thom9230/Projects/polygons/sources/MZ - who\'s on first/common/'
    // recursive walk over folders and grab each file
    recursive(basePath, ["*.md", "*.csv", ".DS_Store"], function (err, filePaths) {

      const docIndex = {
        index: {
          _index: config.elasticsearch.polygonsIndex,
          _type: config.elasticsearch.polygonsType
        }
      }

      // `filePaths` is an array of absolute file paths
      // iterate over filePaths and push it and index to bulk
      filePaths.forEach((filePath, idx) => {
        // sleep.msleep(10)
        // console.log(idx)
        let currentFile = JSON.parse(fs.readFileSync(filePath, 'utf8')) // load .geojson as json object
        currentFile.geometry = simplify(currentFile, 0.01)
        esHelper.pushIntoIndex(config.elasticsearch.polygonsIndex, config.elasticsearch.polygonsType, currentFile, currentFile.id)
        .then(() => { console.log('Indexed: ' + idx) })
        .catch(e => { console.log(e) })
      })

    });
  })
