module.exports = {
  query: {
    function_score: {
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
      ,
      functions: [
        {
          gauss: {
            nested: {
              path: properties: {
                center: {
                  origin: {
                    lat: null,
                    lon: null
                  },
                  offset: null,
                  scale: null
                }
              }
            }
          }
        }
      ]
    }
  }
}
