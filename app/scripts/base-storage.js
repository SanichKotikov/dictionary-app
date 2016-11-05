'use strict';

// node modules
const jsonStorage = require('electron-json-storage');

class BaseStorage {

    constructor(storageKey) {
        this.key = storageKey;
        this.list = [];

        this.exist().then(res => {
            if (!res) return;
            this.read();
        });
    }

    exist() {
        return new Promise(resolve => {
            jsonStorage.has(this.key, (error, hasKey) => {
                if (error) throw error;
                resolve(hasKey);
            });
        });
    }

    read() {
        return new Promise(resolve => {
            jsonStorage.get(this.key, (error, data) => {
                if (error) throw error;
                this.list = (Array.isArray(data) && data.length) ? data : [];
                resolve();
            });
        });
    }

    save() {
        return new Promise(resolve => {
            jsonStorage.set(this.key, this.list, error => {
                if (error) throw error;
                resolve();
            });
        });
    }

    has(id) {
        return !!(this.get(id));
    }

    get(id) {
        return this.list.find(item => item.id === id);
    }

    add(item) {
        return new Promise(resolve => {
            if (this.has(item.id)) {
                resolve([...this.list]);
            } else {
                this.list.push(item);
                this.save().then(() => resolve([...this.list]));
            }
        });
    }

    update(item) {
        return new Promise(resolve => {
            this.list = this.list.map(cur => (cur.id === item.id) ? item : cur);
            this.save().then(() => resolve(this.list));
        });
    }

    remove(id) {
        return new Promise(resolve => {
            this.list = this.list.filter(item => item.id !== id);
            this.save().then(() => resolve([...this.list]));
        });
    }

    getList() {
        return [...this.list];
    }
}

module.exports = BaseStorage;
