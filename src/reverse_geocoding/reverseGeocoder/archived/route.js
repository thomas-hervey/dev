// var turfArea = require('turf-area')
// var turfCentroid = require('turf-centroid')
// var turfExtent = require('turf-Extent')

const turf = require('@turf/turf')

const execute = require('./archived/old_reverse_geocoder')


function route (req, res) {
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
  let bbox
  if (query.extent) { bboxFeature = parseExtent(req) }

  const results = getDocuments(req, bboxFeature).then(resp => {
    if (resp && resp.hits && resp.hits.total >= '1') {
      console.log(resp.hits.hits[0])
      console.log(resp.hits.hits[0]._source.properties.name)

      let about = '<placeholder>'
      let related = []

      // get id, names of hits
      const hitIDs = resp.hits.hits.map((hit) => {
        const details = getResultDetails(hit)
        related.push(details)
      })

      // formulate enrichment from hits
      const geoEnrichment = {
        places: {
          about: about,
          related: related
        }
      }
      console.log(geoEnrichment.places.related)
      return geoEnrichment

    } else throw new Error('Error in response or not enough hits: ', resp)
  })
  return results
}

function getResultDetails (hit) {
  const source = hit._source
  const id = source.id
  const name = source.properties.name
  return {
    id: id,
    name: name
  }
}

function parseExtent(req) {
  // TODO: more checks and complex geometry handling

  const inputExtent = JSON.parse(req.query.extent)

  // if input extent is is [[xmin, ymin], [xmax, ymax]]
  if (Array.isArray(inputExtent) && inputExtent.length === 2) {

    const reducedExtent = inputExtent.reduce(function(a, b) { return a.concat(b) })
    const bboxFeature = turf.bboxPolygon(reducedExtent)

    // create a feature
    let extent = []
    extent.push(bboxFeature.geometry.coordinates[0][0])
    extent.push(bboxFeature.geometry.coordinates[0][2])
    bboxFeature.properties.extent = extent
    return bboxFeature
  } else if (typeof inputExtent === 'object' && inputExtent.type === 'Feature') {
    console.log('Input extent is a feature')
    return inputExtent
  }
  throw new Error('Unhandled extent type: ' + typeof extent)

}

function getDocuments(req, bboxFeature) {

  const client = require('../../es_setup/connection')

  let updatedPayload

  // Thomas Generated
  updatedPayload = require('./query_payload_envelope_new')
  updatedPayload.query.filter.geo_shape.geometry.shape.coordinates = bboxFeature.properties.extent
  // const area = turf.area(bboxFeature)
  // updatedPayload.query.bool.must[0].range.area.gte = area / 3

  // // Daniel Generated
  // updatedPayload = require('./query_payload')
  // updatedPayload.query.function_score.filter.bool.must.geo_shape.geometry.shape.coordinates = extent

  // // new payload manipulator
  // updatedPayload = updatePayload(bboxFeature)

  return client.search({
    index: req.params.index,
    body: updatedPayload
  })
  .then(resp => { return resp })
  .catch(err => { return err  })
}




function updatePayload (bboxFeature) {
  let payload = require('./query_payload')

  var area = turf.area(bboxFeature)
  var centroid = turf.centroid(bboxFeature).geometry.coordinates
  // var extent = _convertExtent(turfExtent(bboxFeature))
  payload.size = 1
  payload.query.function_score.filter.bool.must[0].geo_shape.geometry.shape = bboxFeature.properties.extent
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

module.exports = route
