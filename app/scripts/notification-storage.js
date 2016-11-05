'use strict';

const BaseStorage = require('./base-storage');

class NotificationLogger extends BaseStorage {

    constructor() {
        super('notification-logger');
    }

    increment(id) {
        let item = this.get(id);

        (item !== undefined)
            ? this.update({ id: id, times: (+item.times) + 1, last: Date.now() })
            : this.add({ id: id, times: 1, last: Date.now() });
    }
}

module.exports = NotificationLogger;
