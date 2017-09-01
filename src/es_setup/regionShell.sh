#!/bin/bash

listFiles="$(find /home/ubuntu/es/copy/polygons/sources/MZ/common/wof-region-20170810T002818-bundle -name *.geojson)"
echo "${listFiles}"

for X in $listFiles
do
  echo $X
  node main.js $X
done
