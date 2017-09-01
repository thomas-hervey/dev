var client = require('../connection.js');

client.indices.delete({
  index: 'playground_index'
}, function(err,resp,status) {
  console.log("delete",resp)
})
