'use strict';

const { app } = require('electron');
const path = require('path');
const url = require('url');

const windowsPath = path.join(app.getAppPath(), 'src', 'windows');

function getWindowPath(name) {
    return url.format({
        pathname: path.join(windowsPath, name, 'index.html'),
        protocol: 'file:',
        slashes: true,
    })
}

module.exports = {
    getWindowPath
};
