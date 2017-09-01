var client = require('./connection.js');

client.indices.delete({
  index: '<add index name>'
}, function(err,resp,status) {
  console.log("delete",resp)
})
