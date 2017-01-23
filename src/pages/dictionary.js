'use strict';

const { remote } = require('electron');
const { Menu } = remote;

import Page from './page';
import Find from '../components/find';
import Card from '../components/card';
import Sheet from '../components/sheet';

import constants from '../scripts/constants';
import storage from '../storages/storage';
import helpers from '../scripts/helpers';

const TARGETS = {
    header: 'dict-header',
    sheet: 'dict-sheet',
    history: 'dict-history',
};

class DictPage extends Page {

    constructor(templateId) {
        super(templateId, TARGETS);

        this.findComp = new Find(this.onFindChange.bind(this));
        helpers.replaceHtml(this[TARGETS.header], this.findComp.html);

        if (storage.currentDict) {
            this.setDict();
        }

        this.bindHandlers();
        this.renderHistory();
    }

    setDict() {
        this.findComp.updateText();
        this.renderSheet(storage.currentDict.data);
    }

    bindHandlers() {
        this[TARGETS.history].addEventListener('click', event => this.onHistoryClick(event));
        this[TARGETS.history].addEventListener('contextmenu', event => this.onHistoryContext(event));
    }

    onFindChange(dict, cached) {
        storage.currentDict = dict;
        this.renderSheet(dict.data);

        // TODO:
        if (!cached && dict.data.length) {
            storage.history.add(dict)
                .then(list => this.renderHistory(list));
        } else {
            storage.history.update(dict);
        }
    }

    onHistoryClick(event) {
        const target = event.target;

        if (target.classList.contains(constants.TEASER_CARD_CLASS)) {
            event.stopPropagation();

            storage.currentDict = storage.history.get(target.dataset.name);
            this.setDict();
        }
    }

    onHistoryContext(event) {
        const target = event.target;

        if (target.classList.contains(constants.TEASER_CARD_CLASS)) {
            event.stopPropagation();
            event.preventDefault();

            const menu = Menu.buildFromTemplate([{
                label: 'Delete',
                click: () => storage.history.remove(target.dataset.name)
                    .then(list => this.renderHistory(list))
            }]);

            menu.popup(remote.getCurrentWindow());
        }
    }

    renderSheet(cards) {
        const sheet = new Sheet(cards);
        helpers.replaceHtml(this[TARGETS.sheet], sheet.html, true);
    }

    renderHistory(list = null) {
        const promise = (list !== null)
            ? new Promise(resolve => resolve(list))
            : storage.history.read();

        promise.then(() => {
            const html = document.createDocumentFragment();
            const list = storage.history.getList().reverse();

            console.info(list.length);

            for (const item of list) {
                html.appendChild((new Card(item, true)).html());
            }

            helpers.replaceHtml(this[TARGETS.history], html);
        });
    }
}

module.exports = DictPage;
