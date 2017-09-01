var client = require('./connection.js');

client.indices.getMapping({
    index: 'polygons_index'
  },
function (error,response) {
    if (error){ console.log(error.message) }
    else { console.log(response) }
})
