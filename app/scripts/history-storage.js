'use strict';

// node modules
const jsonStorage = require('electron-json-storage');

class HistoryStorage {

    constructor(storageKey) {
        this._key = storageKey;
        this._list = [];

        this.exist().then(res => {
            if (!res) return;
            this.read();
        });
    }

    exist() {
        return new Promise(resolve => {
            jsonStorage.has(this._key, (error, hasKey) => {
                if (error) throw error;
                resolve(hasKey);
            });
        });
    }

    read() {
        return new Promise(resolve => {
            jsonStorage.get(this._key, (error, data) => {
                if (error) throw error;
                this._list = (Array.isArray(data) && data.length) ? data : [];
                console.log(this._list.length);
                resolve();
            });
        });
    }

    save() {
        return new Promise(resolve => {
            jsonStorage.set(this._key, this._list, error => {
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
        return [...this._list];
    }

    getSortedCopyOfList() {
        return [...this._list].sort((a, b) => {
            if (a.text < b.text) return -1;
            if (a.text > b.text) return 1;
            return 0;
        });
    }
}

module.exports = HistoryStorage;
