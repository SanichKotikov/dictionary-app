'use strict';

const BaseStorage = require('./base-storage');

class HistoryStorage extends BaseStorage {

    // read() {
    //     return new Promise(resolve => {
    //         super.read().then(() => {
    //             if (this.list.length && this.list[0]['id'] === undefined) {
    //                 for (const item of this.list) {
    //                     item.id = item.text;
    //                     delete item.text;
    //                 }
    //                 this.save().then(() => resolve());
    //             } else {
    //                 resolve();
    //             }
    //         });
    //     });
    // }

    getSortedCopyOfList() {
        return [...this.list].sort((a, b) => {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
        });
    }
}

module.exports = HistoryStorage;
