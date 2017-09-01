const express = require('express')
const app = express()

const config = require('./config')
const reverseGeocoder = require('./reverseGeocoder')

function setupServer() {

  app.get('/', (req, res) => { res.send('Example Reverse Geocoder') })
  app.get('/:index', (req, res) => { reverseGeocoder.reverseGeocoder(req, res) })

  app.listen(config.port, () => {
    console.log(`Example app listening on port: ${config.port}`)
  })
}

setupServer()

module.exports = app

// ssh -L 9201:localhost:9200 ubuntu@34.229.180.217
