const execute = require('./reverseGeocode')

function route (req, res) {
  const index = req.params && req.params.index
  switch (index) {
    case 'polygons_index':
      return shapeIndexHandler(req, res)
    default:
      return []
  }
  // const query_payload = exectute(req)
  // return client.search({
  //   index: 'polygons_index',
  //   body: query_payload // query_payload_envelope
  // })
  // .then(resp => { return resp })
  // .catch(err => { return err  })
}

function shapeIndexHandler(req, res) {
  const query = req.query || {}

  let extent
  if (query.extent) {
    parsedExtent = parseExtent(req, res)
  }
  const geom = getDocuments(req, parsedExtent).then(resp => {
    return getGeom(resp)
  })
}

function parseExtent(req, res) {
  const extent = JSON.parse(req.query.extent)
  if (!Array.isArray(extent)) throw new Error('Extent must by an array, got: ' + typeof extent)
  // TODO: more checks and complex geometry handling
  return extent

}

function getDocuments(req, extent) {
  const client = require('../../es_setup/connection')
  const query_payload_envelope = require('./query_payload_envelope')
  query_payload_envelope.query.bool.filter.geo_shape.geometry.shape.coordinates = extent

  const query_payload = require('./query_payload')
  query_payload.query.function_score.filter.bool.must.geo_shape.geometry.shape.coordinates = extent

  return client.search({
    index: 'polygons_index',
    body: query_payload // query_payload_envelope
  })
  .then(resp => { return resp })
  .catch(err => { return err  })
}

function getGeom(response) {
  const hits = response.hits.hits
  console.log(hits[0])
}

  // req.query = req.query || {}
  //
  // if (req.query.extent) {
  //   console.log(req.query.extent)
  //   getRemoteData(req).then(resp => {
  //     const geom = getFirstHitGeom(resp)
  //     // return geom
  //     return res.send(geom)
  //   })
  // } else {
  //   console.log(req.url)
  // }
// }


function getRemoteData(req, res) {
  const client = require('../../es_setup/connection')
  const query_payload_envelope = require('./query_payload_envelope')

  const extent = req.query.extent
  const extent2 = [
    [-109.060256, 36.992424],
    [-102.040878, 41.003444]
  ]
  console.log(typeof JSON.parse(extent))
  console.log(typeof extent2)

  query_payload_envelope.query.bool.filter.geo_shape.geometry.shape.coordinates = JSON.parse(extent)

  return client.search({
    index: 'polygons_index',
    // body: {
    //   query: {
    //     bool: {
    //       must: {
    //         match_all: {}
    //       },
    //       filter: {
    //         geo_shape: {
    //           geometry: {
    //             shape: {
    //               type: 'envelope',
    //               coordinates: JSON.parse(extent)
    //             },
    //             relation: 'within'
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    body: query_payload_envelope
  }).then(resp => {
    return resp
  }).catch(err => {
    return err
  })
}

function getFirstHitGeom(resp) {
  const firstHit = resp.hits.hits[0]
  return firstHit.geometry
}

module.exports = route

// client.search({
//   index: indexValue,
//   body: {
//     query: {
//       match: {
//         id: idValue
//       }
//     }
//   }
// }, function (error, response) {
//   if (error) console.log('error: ', error)
//   return response
// })

// function route2 (req, res, input, options) {
//   req.query = req.query || {}
//   req.query = coerceQuery(req.query)
//   req.params = req.params || {}
//   if (req.query.callback) req.query.callback = sanitizeCallback(req.query.callback)
//   Object.keys(req.query).forEach(key => {
//     req.query[key] = tryParse(req.query[key])
//   })
//
//   // if this is for a method we can handle like query
//   const method = req.params && req.params.method
//   switch (method) {
//     case 'query':
//       return execute(feature, limit, callback)
//     default:
//       console.log('default method')
//       return
//   }
// }
