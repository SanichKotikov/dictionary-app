const jsonStorage = require('electron-json-storage');

class BaseStorage<T extends any> {

    public list: T[];

    constructor(public key: string) {
        this.list = [];

        this.exist().then(res => {
            if (!res) return;
            this.read();
        });
    }

    exist(): Promise<boolean> {
        return new Promise(resolve => {
            jsonStorage.has(this.key, (error, hasKey) => {
                if (error) throw error;
                resolve(hasKey);
            });
        });
    }

    read(): Promise<any> {
        return new Promise(resolve => {
            jsonStorage.get(this.key, (error, data) => {
                if (error) throw error;
                this.list = (Array.isArray(data) && data.length) ? data : [];
                resolve();
            });
        });
    }

    save(): Promise<any> {
        return new Promise(resolve => {
            jsonStorage.set(this.key, this.list, error => {
                if (error) throw error;
                resolve();
            });
        });
    }

    has(id: string | number): boolean {
        return !!(this.get(id));
    }

    get(id: string | number): T {
        return this.list.find(item => item.id === id);
    }

    add(item: T): Promise<T[]> {
        return new Promise(resolve => {
            if (this.has(item.id)) {
                resolve([...this.list]);
            } else {
                this.list.push(item);
                this.save().then(() => resolve([...this.list]));
            }
        });
    }

    update(item: T): Promise<T[]> {
        return new Promise(resolve => {
            this.list = this.list.map(cur => (cur.id === item.id) ? item : cur);
            this.save().then(() => resolve(this.list));
        });
    }

    remove(id: string | number): Promise<T[]> {
        return new Promise(resolve => {
            this.list = this.list.filter(item => item.id !== id);
            this.save().then(() => resolve([...this.list]));
        });
    }

    getList(): T[] {
        return [...this.list];
    }
}

export default BaseStorage;
