import BaseStorage from './base-storage';

interface NotificationLoggerItem {
    id: number;
    times: number;
    last: number;
}

class NotificationLogger extends BaseStorage<NotificationLoggerItem> {

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

export default NotificationLogger;
