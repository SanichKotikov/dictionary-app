'use strict';

const Page = require('./page');
const FavoriteCard = require('../components/favorite-card');
const Sheet = require('../components/sheet');

const storage = require('../scripts/storage');

const TARGETS = {
    list: 'favorite-list',
    sheet: 'favorite-sheet',
};

class FavoritePage extends Page {

    constructor(templateId) {
        super(templateId, TARGETS);
        const list = storage.favorite.getSortedCopyOfList();

        for (const item of list) {
            this[TARGETS.list].appendChild((new FavoriteCard(item)).html());
        }

        this.bindHandlers();
    }

    bindHandlers() {
        this[TARGETS.list].addEventListener('click', event => this.onListClick(event));
    }

    onListClick(event) {
        const target = event.target;

        if (target.classList.contains('favorite-card')) {
            event.stopPropagation();

            const dict = storage.favorite.get(target.dataset.name);
            const sheet = new Sheet(dict.data);

            this[TARGETS.sheet].innerHTML = '';
            setTimeout(() => this[TARGETS.sheet].appendChild(sheet.html), 30);
        }
    }
}

module.exports = FavoritePage;
