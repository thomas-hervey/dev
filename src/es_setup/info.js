var client = require('./connection.js');

client.ping({
  requestTimeout: 60000,
}, function (error) {
  if (error) { console.error('elasticsearch cluster down') }
  else { console.log('all is well') }
})

client.cluster.health({}, function(err, resp, status){
  console.log('-- client health --\n', resp)
})

client.count({index: 'polygons_index',type: 'polygons_type'},function(err,resp,status) {
  console.log("polygons_type:\n", resp)
});
