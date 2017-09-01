#!/bin/bash

listFiles="$(find /home/ubuntu/es/copy/polygons/sources/MZ/common/wof-country-20170809T234655-bundle -name *.geojson)"
echo "${listFiles}"

for X in $listFiles
do
  echo $X
  node main.js $X
done
