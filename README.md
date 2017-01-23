# dictionary app

Just a prototype.

Using [Yandex Dictionary](https://tech.yandex.ru/dictionary/) API.

## Prep

Obtain a free [API key](https://tech.yandex.ru/keys/get/?service=dict)

Create `keys.js` in the root, with this content:

```js
module.exports = {
    yaDictionary: '<API key here>'
};
```

## Install & Run

```bash
# install dependencies
$ npm i

# copy files & run ts watcher
$ npm run watch

# in separate tab
# run electron
$ npm start
```

## Build

Darwin x64 only (temporarily)

```bash
$ npm run build
```
    