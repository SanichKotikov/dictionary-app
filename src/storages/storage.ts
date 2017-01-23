import { DictItem } from '../scripts/interfaces';

import FavoriteStorage from './favorite-storege';
import FavoriteSetStorage from './favorite-set-storage';
import HistoryStorage from './history-storage';

interface storageInterface {
    currentDict: DictItem,
    currentFavorite: FavoriteSetStorage,
    currentFavoriteDict: DictItem,
    dictionary: any,
    notifications: any,
    favorite: FavoriteStorage,
    history: HistoryStorage,
}


const storage: storageInterface = {
    currentDict: null,
    currentFavorite: null,
    currentFavoriteDict: null,
    dictionary: null,
    notifications: null,
    favorite: null,
    history: null,
};

export default storage;
