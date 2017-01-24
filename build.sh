#!/usr/bin/env bash

dist="dist"

# clear dist folder
rm -r $dist

# copy & compile files
./node_modules/.bin/copy "./src/**/*.{html,css}" "./$dist/src"
./node_modules/.bin/copy "./images/*.png" "./$dist/images"
cp "./package.json" "./$dist/package.json"
cp "./keys.js" "./$dist/keys.js"
./node_modules/.bin/tsc --outDir "./$dist/src" --sourceMap false

# install production dependencies
cd "./$dist"
npm install --production
cd ..

# build app
./node_modules/.bin/electron-packager \
    "./$dist" \
    --platform=darwin \
    --arch=x64 \
    --icon=./images/icon.icns \
    --out=build \
    --overwrite

# clear dist folder
rm -r $dist
