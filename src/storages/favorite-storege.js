'use strict';

const BaseStorage = require('./base-storage');

class FavoriteStorage extends BaseStorage {

    hasName(name) {
        return !!this.list.find(item => item.name === name);
    }
}

module.exports = FavoriteStorage;
