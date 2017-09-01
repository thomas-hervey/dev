module.exports = {
  query: {
    filter: {
      geo_shape: {
        geometry: {
          shape: {
            type: 'envelope',
            coordinates: []
          },
          relation: 'intersects'
        }
      }
    }
  }
}
