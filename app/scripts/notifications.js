'use strict';

// node modules
const path = require('path');

// app modules
const constants = require('./constants');
const storage = require('./storage');
const helpers = require('./helpers');

class Notifications {

    constructor(onClick) {
        this.onClick = onClick || function () {};
        this.timer = 0;

        this.run();
    }

    run() {
        clearInterval(this.timer);
        let notification;

        this.timer = setInterval(() => {
            notification = null;

            storage.favorite.read().then(() => {
                const list = storage.favorite.list();
                const index = helpers.getRandom(0, list.length);
                const dict = list[index];

                notification = new Notification(`${dict.text} :: [${dict.data[0].ts}]`, {
                    tag: 'dict-app-random-word',
                    body: dict.data.map(item => item.tr[0].text).join(', '),
                });

                notification.onclick = () => {
                    this.onClick(dict);
                };
            });
        }, constants.TIME_HOUR / 2);
    }
}

module.exports = Notifications;
