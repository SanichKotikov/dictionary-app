import BaseStorage from './base-storage';
import { dictItemInterface } from './storage';

export interface FavoriteSetStorageItem {
    id: number;
    key: string;
    list: dictItemInterface[];
}

class FavoriteSetStorage extends BaseStorage<dictItemInterface> {

    constructor(public id: number) {
        super(`favorite-${id}`);
    }
}

export default FavoriteSetStorage;
