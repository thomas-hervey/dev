curl -XGET 'localhost:9201/polygons_index/_search?pretty' -H 'Content-Type: application/json' -d'
{
    "query":{
        "bool": {
            "must": {
                "match_all": {}
            },
            "filter": {
                "geo_shape": {
                    "geometry": {
                        "shape": {
                            "type": "envelope",
                            "coordinates" : [[12.40, 43.90],[12.47, 43.97]]
                        },
                        "relation": "within"
                    }
                }
            }
        }
    }
}
'
