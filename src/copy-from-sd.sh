#!/usr/bin/env bash

# usage: ./copy-from-sd.sh source destination
# iterate on given directory
# add .csv extension to files
for f in $1*; do
    # bash string manipulation => http://www.tldp.org/LDP/LG/issue18/bash.html
    basename=${f##*/}
    cp $f $2$basename.csv
done
