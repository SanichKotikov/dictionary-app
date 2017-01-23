#!/usr/bin/env bash

app="app"

rm -r $app

./node_modules/.bin/copy "./src/**/*.{html,css}" "./$app/src"
./node_modules/.bin/copy "./images/*.png" "./$app/images"
cp "./package.json" "./$app/package.json"
cp "./keys.js" "./$app/keys.js"
./node_modules/.bin/tsc --watch --outDir "./$app/src"
