#!/bin/bash

listFiles="$(find /home/ubuntu/es/copy/polygons/sources/MZ/common_optional/county -name *.geojson)"
echo "${listFiles}"

for X in $listFiles
do
  echo $X
  node main.js $X
done
