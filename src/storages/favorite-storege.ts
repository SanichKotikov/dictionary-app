import BaseStorage from './base-storage';

export interface FavoriteStorageItem {
    id: number;
    name: string;
}

class FavoriteStorage extends BaseStorage<FavoriteStorageItem> {

    hasName(name: string): boolean {
        return !!this.list.find((item: FavoriteStorageItem) => item.name === name);
    }
}

export default FavoriteStorage;
