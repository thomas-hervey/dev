const bboxPolygon = require('@turf/bbox-polygon')
const turfArea = require('@turf/area')
const turfCentroid = require('@turf/centroid')
const util = require('util')

function reverseGeocoder (req, res) {
  const index = req.params && req.params.index
  switch (index) {
    case 'polygons_index':
      res.send(shapeIndexHandler(req))
    default:
      return []
  }
}

function shapeIndexHandler(req) {
  const query = req.query || {}

  let extent
  let extentFeature
  if (!query.extent) {
    console.error('No input query.extent')
    return 'No input query.extent'
  }

  // create a feature from input extent
  extentFeature = createFeature(req)

  // query documents
  let thing = getDocuments(req, extentFeature)
    // parse response
    .then(resp => {
      if(resp.hits && resp.hits.total >= '1') {
        return organizeHits(resp)
      } else {
        console.log('NO HITS RETURNED')
        return 'NO HITS RETURNED'
      }
    })
    .catch(err => { return err })
  console.log(util.inspect(thing, false, null))
  return thing
}

//   const hits = resp.hits.hits
//   // format a response for each hit
//   hits.map(hit => {
//     let result = {
//       id: hit._source.id,
//       country: null,
//       region: null,
//       county: null
//     }
//
//     // grab hierarchy values
//     const hierarchy = hit._source.properties.hierarchy[0]
//     const hierarchyValues = Object.values(hierarchy)
//
//     // check and see if another hit is within this hierarchy
//     hits.map(hit => {
//       if(hierarchyValues.includes(hit._source.id)) {
//         const placeType = hit._source.properties.placeType
//         const name = hit._source.properties.name
//         result[placeType] = name
//       }
//     })
//     places.related.push(result)
//   })
//   return places
// }

function createFeature(req) {
  const inputExtent = JSON.parse(req.query.extent)
  const reducedExtent = inputExtent.reduce(function(a, b) { return a.concat(b) })
  const feature = bboxPolygon(reducedExtent)
  feature.properties.extent = inputExtent
  return feature
}

function getDocuments(req, extentFeature) {
  // setup elastic search client connection
  const client = require('../../es_setup/connection')
  const payload = getPayload(extentFeature)

  return client.search({
    index: req.params.index,
    body: payload
  })
  .then(resp => { return resp })
  .catch(err => { return err  })
}

function getPayload(extentFeature) {
  // create es search payload
  let payload

  if(1 === 1) {
    // just return all intersections
    payload = require('./payloads/intersection_payload')
    payload.query.bool.filter.geo_shape.geometry.shape.coordinates = extentFeature.properties.extent
    return payload
  }
  // TODO: fix query & run agains `shape_index`, onces finished indexing
  else if (1 === 2) {
    payload = require('./payloads/query_payload')

    const area = turfArea(extendedFeature)
    const center = turfCentroid(extendedFeature)

    payload.size = 1 // TODO: change this so that we don't only get one result
    payload.query.function_score.query.bool.must[0].geo_shape.geometry.shape.coordinates = extentFeature.properties.extent
    payload.query.function_score.query.bool.must[1].range.area.gte = area / 3
    payload.query.function_score.functions[0].gauss.center.origin.lon = center[0]
    payload.query.function_score.functions[0].gauss.center.origin.lat = center[1]
    payload.query.function_score.functions[0].gauss.center.offset = ((Math.sqrt(area) / 1000) * 0.1).toString() + 'km'
    payload.query.function_score.functions[0].gauss.center.scale = ((Math.sqrt(area) / 1000) * 0.5).toString() + 'km'
    payload.query.function_score.functions[1].gauss.area.origin = area.toString()
    payload.query.function_score.functions[1].gauss.area.offset = (area * 0.25).toString()
    payload.query.function_score.functions[1].gauss.area.scale = (area * 0.5).toString()
    return payload
  }
  // TODO: create in house overlap percentage calculator for ranking
  else if (1 === 2) {
    payload = require('./payloads/query_payload')
  }
  else { return 'no query payload selected' }
}

function organizeHits(resp) {
  let places = {
    about: '<top hit place>',
    related: []
  }
  const hits = resp.hits.hits
  // format a response for each hit
  places.related = hits.map(hit => {
    return formatHit(hit, hits)
  })
  console.log(util.inspect(places, false, null))
  return places
}

function formatHit(hit, hits) {
  let place = {
    id: hit._source.id,
    country: null,
    region: null,
    county: null
  }

  // grab hierarchy values
  const hierarchy = hit._source.properties.hierarchy[0]
  const hierarchyValues = Object.values(hierarchy)

  // check and see if another hit is within this hierarchy
  hits.map(hit => {
    if(hierarchyValues.includes(hit._source.id)) {
      const placeType = hit._source.properties.placeType
      const name = hit._source.properties.name
      place[placeType] = name
    }
  })
  return place
}

module.exports = reverseGeocoder
