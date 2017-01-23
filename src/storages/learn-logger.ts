import BaseStorage from './base-storage';

interface LearnLoggerItem {
    id: string;
    times: number;
    last: number;
}

class LearnLogger extends BaseStorage<LearnLoggerItem> {

    constructor() {
        super('learn-logger');
    }

    increment(id: string) {
        let item = this.get(id);

        (item !== undefined)
            ? this.update({ id: id, times: (+item.times) + 1, last: Date.now() })
            : this.add({ id: id, times: 1, last: Date.now() });
    }
}

export default LearnLogger;
