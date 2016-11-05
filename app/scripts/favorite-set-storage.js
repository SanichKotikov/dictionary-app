'use strict';

const BaseStorage = require('./base-storage');

class FavoriteSetStorage extends BaseStorage {

    constructor(id) {
        super(`favorite-${id}`);
        this.id = id;
    }
}

module.exports = FavoriteSetStorage;
