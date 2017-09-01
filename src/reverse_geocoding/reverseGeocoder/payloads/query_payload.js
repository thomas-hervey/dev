module.exports = {
  query: {
    bool: {
      must: [
        {
          geo_shape: {
            geometry: {
              shape: {
                type: 'envelope',
                coordinates: null
              },
              relation: 'intersects'
            }
          }
        }
      ]
    }
    // function_score: {
    //   query: {
    //     bool: {
    //       must: [
    //         {
    //           geo_shape: {
    //             geometry: {
    //               shape: {
    //                 type: 'envelope',
    //                 coordinates: null
    //               }
    //             }
    //           }
    //         },
    //         {
    //           range: {
    //             area: {
    //               gte: null
    //             }
    //           }
    //         }
    //       ]
    //     }
    //   },
    //   functions: [
    //     {
    //       gauss: {
    //         center: {
    //           origin: {
    //             lat: null,
    //             lon: null
    //           },
    //           offset: null,
    //           scale: null
    //         }
    //       },
    //       weight: 2
    //     },
    //     {
    //       gauss: {
    //         area: {
    //           origin: null,
    //           offset: null,
    //           scale: null
    //         }
    //       }
    //     }
    //   ],
    //   score_mode: 'multiply'
    // }
  },
  stored_fields: [
    '_source'
  ]
}
