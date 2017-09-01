module.exports = {
  query: {
    function_score: {
      filter: {
        bool: {
          must: [
            {
              geo_shape: {
                geometry: {
                  shape: {
                    type: 'envelope',
                    coordinates: null
                  }
                }
              }
            },
            {
              range: {
                area: {
                  gte: null
                }
              }
            }
          ]
        }
      },
      functions: [
        {
          gauss: {
            center: {
              origin: {
                lat: null,
                lon: null
              },
              offset: null,
              scale: null
            }
          },
          weight: 2
        },
        {
          gauss: {
            area: {
              origin: null,
              offset: null,
              scale: null
            }
          }
        }
      ],
      score_mode: 'multiply'
    }
  },
  fields: [
    '_source'
  ]
}
