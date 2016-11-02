'use strict';

const { remote } = require('electron');
const { Menu } = remote;

const Page = require('./page');
const Find = require('../components/find');
const Card = require('../components/card');
const Sheet = require('../components/sheet');

const constants = require('../scripts/constants');
const storage = require('../scripts/storage');
const helpers = require('../scripts/helpers');

const TARGETS = {
    header: 'dict-header',
    sheet: 'dict-sheet',
    history: 'dict-history',
};

class DictPage extends Page {

    constructor(templateId) {
        super(templateId, TARGETS);

        if (storage.currentDict) {
            this.setDict();
        }

        const find = new Find(this.onFindChange.bind(this));
        this[TARGETS.header].innerHTML = '';
        this[TARGETS.header].appendChild(find.html);

        this.bindHandlers();
        this.renderHistory();
    }

    setDict() {
        this[TARGETS.input].value = storage.currentDict.text;
        this.renderSheet(storage.currentDict.data);
    }

    bindHandlers() {
        this[TARGETS.history].addEventListener('click', event => this.onHistoryClick(event));
        this[TARGETS.history].addEventListener('contextmenu', event => this.onHistoryContext(event));
    }

    onFindChange(data, cache) {
        this.renderSheet(data);

        if (!cache && data.length) {
            storage.history.add(storage.currentDict)
                .then(list => this.renderHistory(list));
        } else {
            storage.history.update(storage.currentDict);
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

        this[TARGETS.sheet].innerHTML = '';
        setTimeout(() => this[TARGETS.sheet].appendChild(sheet.html), 30);
    }

    renderHistory(list = null) {
        const promise = (list !== null)
            ? new Promise(resolve => resolve(list))
            : storage.history.read();

        promise.then(() => {
            const html = document.createDocumentFragment();
            const list = storage.history.list();
            console.log(list.length);
            list.reverse();

            this[TARGETS.history].innerHTML = '';

            for (const item of list) {
                html.appendChild((new Card(item, true)).html());
            }

            this[TARGETS.history].appendChild(html);
        });
    }
}

module.exports = DictPage;
