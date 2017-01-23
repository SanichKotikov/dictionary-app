import BaseStorage from './base-storage';
import { dictItem } from '../scripts/interfaces';

export interface FavoriteSetStorageItem {
    id: number;
    key: string;
    list: dictItem[];
}

class FavoriteSetStorage extends BaseStorage<dictItem> {

    constructor(public id: number) {
        super(`favorite-${id}`);
    }
}

export default FavoriteSetStorage;
