'use strict';

class Favorite {

    constructor(storage, storageKey) {
        this._storage = storage;
        this._key = storageKey;
        this._list = [];

        this.exist().then(res => {
            if (!res) return;

            this._storage.get(this._key, (error, data) => {
                if (error) throw error;

                if (Array.isArray(data) && data.length) {
                    console.log(data.length);
                    this._list = data;
                }
            });
        });
    }

    exist() {
        return new Promise(resolve => {
            this._storage.has(this._key, (error, hasKey) => {
                if (error) throw error;
                resolve(hasKey);
            });
        });
    }

    save() {
        return new Promise(resolve => {
            this._storage.set(this._key, this._list, error => {
                if (error) throw error;
                resolve();
            });
        });
    }

    add(dict) {
        return new Promise(resolve => {
            if (this.has(dict.text)) resolve(this._list);

            // TODO: optimise dict.data before
            this._list.push(dict);
            this.save().then(() => resolve(this._list));
        });
    }

    get(text) {
        return this._list.find(item => item.text === text);
    }

    update(dict) {
        return new Promise(resolve => {
            this._list = this._list.map(item => {
                return (item.text === dict.text) ? dict : item;
            });

            this.save().then(() => resolve(this._list));
        });
    }

    has(text) {
        return !!(this.get(text));
    }

    list() {
        return this._list;
    }
}

module.exports = Favorite;
