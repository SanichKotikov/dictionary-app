'use strict';

// node modules
const storage = require('electron-json-storage');

// app modules
const constants = require('./scripts/constants');
const state = require('./scripts/state');
const YaDictionary = require('./api/ya.dictionary');
const Card = require('./scripts/card');
const Favorite = require('./scripts/favorite');
const FavoriteCard = require('./scripts/favorite-card');

class App {

    constructor(appId) {
        // dom
        this._appEl = document.getElementById(appId || 'app');
        this._pages = this._appEl.querySelectorAll('.page');
        this.initLinks();

        // classes
        this.dictionary = new YaDictionary();
        this.favorite = new Favorite(storage, constants.FAVORITE_STORAGE_KEY);

        this.bindEvents();
    }

    initLinks() {
        for (const item of constants.APP_IDS) {
            this[item.key] = this._appEl.querySelector(`#${item.id}`);
        }
    }

    bindEvents() {
        this['_asideEl'].addEventListener('click', event => this.onAsideClick(event));
        this['_dictAdd'].addEventListener('click', event => this.onDictAddClick(event));
        this['_cardWr'].addEventListener('click', event => this.onCardWrClick(event));
        this['_favoriteList'].addEventListener('click', event => this.onFavoriteListClick(event));
        this['_favoritePageCards'].addEventListener('click', event => this.onCardWrClick(event));

        this['_dictInput'].addEventListener('keyup', event => {
            event.stopPropagation();

            if (event.keyCode === constants.ENTER_KEY_CODE) {
                this.onDictInputClick();
            }
        });
    }

    updatePages() {
        [...this._pages].map(page => {
            page.hidden = page.id !== state.activePageId;
        });
    }

    onAsideClick(event) {
        const target = event.target;
        event.stopPropagation();

        if (target.dataset && target.dataset.page) {
            state.activePageId = target.dataset.page;
            this.updatePages();

            if (state.activePageId === 'favorite-page') {
                this.renderFavorite();
            }
        }
    }

    onDictInputClick() {
        const value = this['_dictInput'].value;
        if (!value) return;

        // TODO: stats os searching
        // TODO: add by second enter

        const now = Date.now();
        const cache = this.favorite.get(value);

        // TODO: remove
        if (cache) {
            console.log('diff: ', (now - cache.timestamp));
            console.log('TIME_DAY: ', constants.TIME_DAY);
        }

        if (cache && (now - cache.timestamp) < constants.TIME_DAY) {
            state.currentDict = cache;
            this.renderCards(cache.data);
            return;
        }

        this.dictionary.get(value).then(json => {
            const data = json.def || [];
            state.currentDict = { text: value, data: data, timestamp: now };
            this.renderCards(data);

            if (!cache) {
                this['_dictAdd'].disabled = false;
            } else {
                this.favorite.update(state.currentDict);
            }
        });
    }

    onCardWrClick(event) {
        const target = event.target;

        if (target.classList.contains('transcription')) {
            event.stopPropagation();

            var msg = new SpeechSynthesisUtterance(target.dataset.text);
            window.speechSynthesis.speak(msg);
        }
    }

    onDictAddClick(event) {
        if (this.favorite.has(state.currentDict.text)) return;
        event.stopPropagation();

        this.favorite.add(state.currentDict).then(list => {
            this['_dictAdd'].disabled = true;
            console.log(list.length);
        });
    }

    onFavoriteListClick(event) {
        const target = event.target;

        if (target.classList.contains('favorite-card')) {
            event.stopPropagation();
            const dict = this.favorite.get(target.dataset.name);
            this.renderCards(dict.data, '_favoritePageCards');
        }
    }

    static renderList(list, el, cls) {
        el.innerHTML = '';
        if (!list.length) return;
        const html = document.createDocumentFragment();

        for (const item of list) {
            html.appendChild((new cls(item)).html());
        }

        el.appendChild(html);
    }

    renderCards(arr, into = '_cardWr') {
        App.renderList(arr, this[into], Card);
    }

    renderFavorite() {
        const list = [...this.favorite.list()].sort((a, b) => {
            if (a.text < b.text) return -1;
            if (a.text > b.text) return 1;
            return 0;
        });

        App.renderList(list, this['_favoriteList'], FavoriteCard);
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
