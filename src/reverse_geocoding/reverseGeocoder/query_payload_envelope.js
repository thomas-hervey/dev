module.exports = {
  query: {
    bool: {
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
}
