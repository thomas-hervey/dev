const bboxPolygon = require('@turf/bbox-polygon')
const bbox = require('@turf/bbox')
const helpers = require('@turf/helpers')
const turfArea = require('@turf/area')
const turfCentroid = require('@turf/centroid')
const util = require('util')

function reverseGeocoder (req, res) {
  console.log('request: ', req.query)
  const index = req.params && req.params.index
  switch (index) {
    case 'shape_index':
      return shapeIndexHandler(req, res)
    default:
      return []
  }
}


function shapeIndexHandler(req, res) {
  const query = req.query || {}

  let extentFeature
  if (query.extent) { extentFeature = createFeature(query.extent) }
  else { console.log('error, no query.extent') }

  // query documents
  return getDocuments(req, extentFeature).then(resp => {
    // hits are returned
    if(resp && resp.hits && resp.hits.total >= '1') {
      const organizedResponse = organizeHits(resp)
      console.log('Response: ', organizedResponse)
      res.send(organizedResponse)

    } else {
      console.log('NO HITS RETURNED')
      res.send(resp)
    }
  })
}

function organizeHits(resp) {
  let places = {
    about: 'top hit result placeholder',
    related: []
  }
  // format a response for each hit
  const hits = resp.hits.hits
  places.related = hits.map(hit => { return formatHit(hit, hits) })
  return places
}

function formatHit(hit, hits) {
  let result = {
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
      result[placeType] = name
    }
  })
  return result
}

function createFeature(extent) {
  const inputExtent = JSON.parse(extent)
  // console.log(inputExtent)
  // const createdBBox = helpers.polygon(extent);

  const reducedExtent = inputExtent.reduce(function(a, b) { return a.concat(b) })
  const feature = bboxPolygon(reducedExtent)
  feature.properties.extent = inputExtent
  return feature
}

// query documents from elasticsearch
function getDocuments(req, extentFeature) {
  // setup elastic search client connection
  const client = require('../../es_setup/connection')
  // get query payload
  const payload = getPayload(extentFeature, req.params.index)

  return client.search({
    index: req.params.index,
    body: payload
  })
  .then(resp => { return resp })
  .catch(err => { return err  })
}

function getPayload(extentFeature, index_name) {

  let payload

  if(index_name === 'shape_index') {
    // just return all intersections
    payload = require('./payloads/intersection_payload')
    payload.query.bool.filter.geo_shape.geometry.shape.coordinates = extentFeature.properties.extent
    return payload
  }
  // TODO: fix query & run against `shape_index`, onces finished indexing
  else if (index_name === 'shape_index' && 1 === 2) {
    payload = require('./payloads/new_payload')

    const area = turfArea(extentFeature)
    const center = turfCentroid(extentFeature).geometry.coordinates

    payload.query.function_score.query.bool.filter.geo_shape.geometry.shape.coordinates = extentFeature.properties.extent
    payload.query.bool.must[1].range.area.gte = area / 10
    payload.size = 1 // TODO: change this so that we don't only get one result
    payload.query.function_score.query.bool.must[0].geo_shape.geometry.shape.coordinates = extentFeature.properties.extent
    payload.query.function_score.query.bool.must[1].range.area.gte = area / 3
    payload.query.function_score.functions[0].gauss.nested.path.origin.lon = center[0]
    payload.query.function_score.functions[0].gauss.location.origin.lat = center[1]
    payload.query.function_score.functions[0].gauss.center.offset = ((Math.sqrt(area) / 1000) * 0.1).toString() + 'km'
    payload.query.function_score.functions[0].gauss.center.scale = ((Math.sqrt(area) / 1000) * 0.5).toString() + 'km'
    payload.query.function_score.functions[1].gauss.area.origin = area.toString()
    payload.query.function_score.functions[1].gauss.area.offset = (area * 0.25).toString()
    payload.query.function_score.functions[1].gauss.area.scale = (area * 0.5).toString()
    return payload
  }
  else { return 'no value selected' }
}

module.exports = reverseGeocoder
