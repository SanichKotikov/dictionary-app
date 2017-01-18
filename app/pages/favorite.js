'use strict';

const Page = require('./page');
const Find = require('../components/find');
const Card = require('../components/card');

const FavoriteSetStorage = require('../scripts/favorite-set-storage');

const constants = require('../scripts/constants');
const storage = require('../scripts/storage');
const helpers = require('../scripts/helpers');

const SET_ITEM_CLASS = 'favorite-set-item';

const TARGETS = {
    sets: 'favorite-sets',
    newSet: 'favorite-new-set',
    words: 'favorite-words',
    wordsFind: 'favorite-words-find',
    history: 'favorite-history',
};

class FavoritePage extends Page {

    constructor(templateId) {
        super(templateId, TARGETS);

        this.findComp = new Find(this.onFindChange.bind(this));
        helpers.replaceHtml(this[TARGETS.wordsFind], this.findComp.html);

        this.bindHandlers();

        this.renderSets();
        this.renderWords();
        this.renderHistory();
    }

    bindHandlers() {
        this[TARGETS.sets].addEventListener('click', event => this.onSetClick(event));
        this[TARGETS.newSet].addEventListener('keyup', event => this.onEnterNewSet(event));
        this[TARGETS.words].addEventListener('click', event => this.onCardClick(event, false));
        this[TARGETS.history].addEventListener('click', event => this.onCardClick(event, true));
    }

    onFindChange(dict, cached) {
        if (!storage.currentFavorite) return;
        if (!dict.data.length) return;

        this.findComp.updateText('');

        storage.currentFavorite.add(dict)
            .then(list => this.renderWords(list));

        // TODO:
        if (!cached && dict.data.length) {
            storage.history.add(dict)
                .then(list => this.renderHistory(list));
        } else {
            storage.history.update(dict);
        }
    }

    onSetClick(event) {
        const target = event.target;

        if (target.classList.contains(SET_ITEM_CLASS)) {
            event.stopPropagation();

            const id = +target.dataset.id;
            storage.currentFavorite = new FavoriteSetStorage(id);

            [...this[TARGETS.sets].querySelectorAll(`.${SET_ITEM_CLASS}`)].map(el => {
                el.setAttribute('active', (+el.dataset.id === id).toString());
            });

            this.renderWords();
        }
    }

    onEnterNewSet(event) {
        event.stopPropagation();
        if (event.keyCode !== constants.ENTER_KEY_CODE) return;

        const name = (this[TARGETS.newSet].value).trim();
        if (!name.length) return;

        const isExist = storage.favorite.hasName(name);

        if (isExist) {
            console.info(`"${name}" exist.`);
            return;
        }

        const list = storage.favorite.add({ id: Date.now(), name: name });
        this[TARGETS.newSet].value = '';
        this.renderSets(list);
    }

    onCardClick(event, isAdd) {
        event.stopPropagation();
        if (!storage.currentFavorite) return;

        const target = event.target;
        if (!target.classList.contains(constants.TEASER_CARD_CLASS)) return;

        const name = target.dataset.name;
        const promise = isAdd
            ? storage.currentFavorite.add(storage.history.get(name))
            : storage.currentFavorite.remove(name);

        promise.then(list => this.renderWords(list));
    }

    renderSets(list = null) {
        const promise = (list !== null)
            ? new Promise(resolve => resolve(list))
            : storage.favorite.read();

        promise.then(() => {
            const html = document.createDocumentFragment();
            const list = storage.favorite.getList().reverse();

            for (const item of list) {
                html.appendChild(helpers.html('div', {
                    class: SET_ITEM_CLASS,
                    'data-id': item.id,
                    active: storage.currentFavorite && item.id === storage.currentFavorite.id
                }, item.name));
            }

            helpers.replaceHtml(this[TARGETS.sets], html, true);
        });
    }

    renderWords(list = null) {
        if (!storage.currentFavorite) return;

        const promise = (list !== null)
            ? new Promise(resolve => resolve(list))
            : storage.currentFavorite.read();

        promise.then(() => {
            const html = document.createDocumentFragment();
            const list = storage.currentFavorite.getList();

            for (const item of list) {
                html.appendChild((new Card(item, true)).html());
            }

            helpers.replaceHtml(this[TARGETS.words], html, true);
        });
    }

    renderHistory() {
        storage.history.read().then(() => {
            const html = document.createDocumentFragment();
            const list = storage.history.getList().reverse();

            for (const item of list) {
                html.appendChild((new Card(item, true)).html());
            }

            helpers.replaceHtml(this[TARGETS.history], html);
        });
    }
}

module.exports = FavoritePage;
