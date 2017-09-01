var turfArea = require('turf-area')
var turfCentroid = require('turf-centroid')
var turfExtent = require('turf-extent')

const payload = require('./query_payload')

const execute = (extent, limit, callback) => {
  // assume a polygon for now, will need logic to differentiate between point and polygon reqs
  const input = JSON.parse(extent)
  const payload = buildPayload(input, limit, callback)
  return
}

const buildPayload = (extent, limit, callback) => {
  const { area, centroid, extent} = calculateGeomFromExtent(extent)

  payload.size = limit || 1
  payload.query.function_score.filter.bool.must[0].geo_shape.geom.shape = extent
  payload.query.function_score.filter.bool.must[1].range.area.gte = area / 3
  payload.query.function_score.functions[0].gauss.center.origin.lon = centroid[0]
  payload.query.function_score.functions[0].gauss.center.origin.lat = centroid[1]
  payload.query.function_score.functions[0].gauss.center.offset = ((Math.sqrt(area) / 1000) * 0.1).toString() + 'km'
  payload.query.function_score.functions[0].gauss.center.scale = ((Math.sqrt(area) / 1000) * 0.5).toString() + 'km'
  payload.query.function_score.functions[1].gauss.area.origin = area.toString()
  payload.query.function_score.functions[1].gauss.area.offset = (area * 0.25).toString()
  payload.query.function_score.functions[1].gauss.area.scale = (area * 0.5).toString()
  return payload
}

function calculateGeomFromExtent(extent) {
  const area = turfArea(extent)
  const centroid = turfCentroid(feature)
  const extent = _convertExtent(turfExtent(feature))
  return area, centroid, extent
}

var _convertExtent = function (coords) {
  var geometry = []
  // upper left
  geometry.push([parseFloat(coords[0]), parseFloat(coords[3])])
  // lower right
  geometry.push([parseFloat(coords[2]), parseFloat(coords[1])])
  var envelope = {
      'type': 'envelope',
      'coordinates': geometry
  }
  return envelope
}

module.exports = execute
