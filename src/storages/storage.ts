import FavoriteStorage from './favorite-storege';
import FavoriteSetStorage from './favorite-set-storage';
import HistoryStorage from './history-storage';

export interface dictItemInterface {
    id: string,
    timestamp: number,
    data: any[],
}

export interface dictDataInterface {
    pos: string;
    text: string;
    tr: dictDataTrInterface[];
    ts: string;
}

export interface dictDataTrInterface {
    ex?: any[];
    mean: any[];
    pos: string;
    syn?: any[];
    text: string;
}

interface storageInterface {
    currentDict: dictItemInterface,
    currentFavorite: FavoriteSetStorage,
    currentFavoriteDict: dictItemInterface,
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
