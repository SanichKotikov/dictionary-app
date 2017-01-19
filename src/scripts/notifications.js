'use strict';

// node modules
const path = require('path');

// app modules
const constants = require('./constants');
const storage = require('../storages/storage');
const helpers = require('./helpers');

const NotificationLogger = require('../storages/notification-storage');

class Notifications {

    constructor(onClick) {
        this.onClick = onClick || function () {};
        this.timer = 0;
        this.logger = new NotificationLogger();

        this.run();
    }

    run() {
        clearInterval(this.timer);
        let notification;

        this.timer = setInterval(() => {
            notification = null;

            storage.history.read().then(() => {
                const list = storage.history.getList();
                const index = helpers.getRandom(0, list.length);
                const dict = list[index];

                notification = new Notification(`${dict.id} :: [${dict.data[0].ts}]`, {
                    tag: 'dict-app-random-word',
                    body: dict.data.map(item => item.tr[0].text).join(', '),
                });

                this.logger.increment(dict.id);

                notification.onclick = () => {
                    this.onClick(dict);
                };
            });
        }, constants.TIME_HOUR / 2);
    }
}

module.exports = Notifications;
