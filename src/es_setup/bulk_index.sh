#!/bin/bash

listFiles="$(find ~/Projects/polygons/sources/MZ/common_optional/county -name *.geojson)"
do
  echo $X
  node bulk_main.js $listFiles
done
