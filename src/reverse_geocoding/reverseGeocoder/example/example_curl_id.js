curl -XGET 'localhost:9201/polygons_index/_search?pretty' -H 'Content-Type: application/json' -d'
{
    "query" : {
        "term" : { "id" : 421202109 }
    }
}
'
