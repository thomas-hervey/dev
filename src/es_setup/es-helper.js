var elasticsearch = require('elasticsearch')
const config = require('./config')

var client = new elasticsearch.Client({
  host: config.elasticsearch.host,
  requestTimeout: 180000
})

module.exports = {
  client: client,

  ping: function () {
    return client.ping({
      // ping usually has a 3000ms timeout
      requestTimeout: 1000
    })
  },

  createIndex: function (indexName) {
    return client.indices.create({
      index: indexName
    })
  },

  createIndexWithMappings: function (indexName, mappingBody) {
    var params = {
      index: indexName,
      body: mappingBody
    }
    return client.indices.create(params)
  },

  createIndexWithMappingsIfNotExists: function (indexName, mappingBody) {
    return this.indexExists(indexName).then(resp => {
      if (!resp) {
        console.log('Index absent, creating one with mapping.', 'notification', 'info')
        return this.createIndexWithMappings(indexName, mappingBody)
      }
    })
  },

  createIndexIfNotExists: function (indexName) {
    return this.indexExists(indexName).then(resp => {
      if (!resp) {
        console.log('Index absent, creating one.', 'notification', 'info')
        return this.createIndex(indexName)
      }
    })
  },

  pushIntoIndex: function (indexName, docType, doc, docId) {
    return client.index({
      index: indexName,
      type: docType,
      id: docId || doc.id,
      body: doc,
      refresh: true,
      requestTimeout: '1800000'
    })
  },

  search: function (indexName, searchBody) {
    return client.search({
      index: indexName,
      body: searchBody
    })
  },

  deleteIndex: function (indexName) {
    return client.indices.delete({
      index: indexName
    })
  },

  indexExists: function (indexName) {
    return client.indices.exists({ index: indexName })
  },

  bulkIndex: function (bulkBody) {
    return client.bulk({
      body: bulkBody,
      requestTimeout: 180000,
      timeout: '180000ms'
    })
  },

  putMapping: function (mappingBody) {
    return client.indices.putMapping(mappingBody)
  },

  getDocument: function (docId, indexName, indexType, options) {
    let request = {
      index: indexName,
      type: indexType,
      id: docId
    }
    if (options) {
      request = Object.assign({}, request, options)
    }

    return client.get(request)
  },

  getDocumentList: function (indexName, indexType, options) {
    let request = {
      index: indexName,
      type: indexType,
      q: '*'
    }
    if (options) {
      request = Object.assign({}, request, options)
    }

    return client.search(request)
  },

  updateDocument: function (indexName, docType, id, updatedDoc) {
    return client.update({
      index: indexName,
      type: docType,
      id: id,
      body: updatedDoc
    })
  }
}
