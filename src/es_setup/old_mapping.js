// const config = require('./config')
//
// let path = `${config.elasticsearch.host}/${config.elasticsearch.polygonsIndex}/${config.elasticsearch.polygonsType}/`
//
//
//
// curl -XPUT path -d '
// {
//   ""
// }

var client = require('./connection')

client.indicies.putMapping({
  index: 'polygons',
  type: 'shape',
  body: {
    properties: {
      
    }
  }
})
