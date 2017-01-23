import BaseStorage from './base-storage';
import { DictItem } from '../scripts/interfaces';

export interface FavoriteSetStorageItem {
    id: number;
    key: string;
    list: DictItem[];
}

class FavoriteSetStorage extends BaseStorage<DictItem> {

    constructor(public id: number) {
        super(`favorite-${id}`);
    }
}

export default FavoriteSetStorage;
