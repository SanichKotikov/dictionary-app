// TODO: https://github.com/Microsoft/TypeScript/issues/3111
declare let Notification: any;

// node modules
// import * as path from 'path';

// app modules
import constants from '../scripts/constants';
import storage from '../storages/storage';
import helpers from './helpers';

import NotificationLogger from '../storages/notification-logger';
import { dictItem } from './interfaces';

class Notifications {

    private timer: any;
    private logger: NotificationLogger;

    constructor(public onClick: (dict: dictItem) => void) {
        this.onClick = onClick || function () {};
        this.timer = 0;
        this.logger = new NotificationLogger();

        this.run();
    }

    run(): void {
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

export default Notifications;
