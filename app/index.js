'use strict';

const { ipcRenderer } = require('electron');

// app modules
const constants = require('./scripts/constants');
const storage = require('./scripts/storage');
const helpers = require('./scripts/helpers');

const YaDictionary = require('./api/ya.dictionary');
const Favorite = require('./scripts/favorite');

const DictPage = require('./pages/dictionary');
const FavoritePage = require('./pages/favorite');

const PAGES = [
    {
        tplId: 'dict-page',
        title: 'dictionary',
        class: DictPage
    },
    {
        tplId: 'favorite-page',
        title: 'favorite',
        class: FavoritePage
    }
];

class App {

    constructor(appId) {
        // dom
        this._appEl = document.getElementById(appId || 'app');
        this._aSide = this._appEl.querySelector('#aside');
        this._pageEl = this._appEl.querySelector('#page');

        // storage
        storage.dictionary = new YaDictionary();
        storage.favorite = new Favorite(constants.FAVORITE_STORAGE_KEY); // TODO: where store ID?

        this.renderPagesButtons();
        this.bindHandlers();

        // default page
        this.showPage(PAGES[0]);
    }

    renderPagesButtons() {
        this._aSide.innerHTML = '';
        const html = document.createDocumentFragment();

        for (const page of PAGES) {
            const props = {
                title: page.title,
                'data-page': page.tplId
            };

            html.appendChild(helpers.html('button', props, page.title.substr(0, 1)));
        }

        this._aSide.appendChild(html);
    }

    bindHandlers() {
        // Catch events from main process
        ipcRenderer.on(constants.SHOW_DICT_EVENT, (event, dict) => this.showDict(dict));

        this._aSide.addEventListener('click', event => this.onAsideClick(event));
    }

    showDict(dict) {
        console.log('showDict');
        storage.currentDict = dict;
        this.showPage(PAGES[0]); // TODO:
    }

    showPage(page) {
        const inst = new page.class(page.tplId);
        this._pageEl.innerHTML = '';
        this._pageEl.appendChild(inst.html);
    }

    onAsideClick(event) {
        const target = event.target;
        event.stopPropagation();

        if (target.dataset && target.dataset.page) {
            const page = PAGES.find(p => p.tplId === target.dataset.page);
            this.showPage(page);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
