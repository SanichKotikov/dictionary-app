'use strict';

const constants = {
    APP_IDS: [
        { key: '_asideEl', id: 'aside' },
        { key: '_dictInput', id: 'dictionary-input' },
        { key: '_dictInputHints', id: 'dictionary-input-hints' },
        { key: '_dictAdd', id: 'dictionary-add-button' },
        { key: '_cardWr', id: 'card-wr' },
        { key: '_favoriteList', id: 'favorite-list' },
        { key: '_favoritePageCards', id: 'favorite-page-cards' }
    ],
    MIN_SEARCH_HINT_LENGTH: 2,
    DICT_HINT_ITEM_CLASS: 'dictionary-input-hint-item',
    ENTER_KEY_CODE: 13,
    FAVORITE_STORAGE_KEY: 'favorite',
    TIME_DAY: 1000 * 60 * 60 * 42
};

module.exports = constants;
