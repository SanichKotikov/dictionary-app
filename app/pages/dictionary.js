'use strict';

const Page = require('./page');
const Sheet = require('../components/sheet');
const FavoriteCard = require('../components/favorite-card');

const constants = require('../scripts/constants');
const storage = require('../scripts/storage');
const helpers = require('../scripts/helpers');

const TARGETS = {
    input: 'dict-input',
    hints: 'dict-hints',
    addButton: 'dict-add-button',
    sheet: 'dict-sheet',
    history: 'dict-history',
};

const HINT_ITEM_CLASS = 'dictionary-input-hint-item';

class DictPage extends Page {

    constructor(templateId) {
        super(templateId, TARGETS);

        if (storage.currentDict) {
            this.setDict(storage.currentDict);
        }

        this.bindHandlers();
        this.renderHistory();
    }

    setDict(dict) {
        this[TARGETS.input].value = dict.text;
        this.renderSheet(dict.data);
    }

    bindHandlers() {
        this[TARGETS.input].addEventListener('input', event => this.onInputChange(event));
        this[TARGETS.hints].addEventListener('click', event => this.onHintClick(event));
        this[TARGETS.addButton].addEventListener('click', event => this.onAddClick(event));
        this[TARGETS.history].addEventListener('click', event => this.onHistoryClick(event));

        this[TARGETS.input].addEventListener('keyup', event => {
            event.stopPropagation();

            if (event.keyCode === constants.ENTER_KEY_CODE) {
                this[TARGETS.hints].hidden = true;
                this.onInputClick();
            }
        });
    }

    onInputChange() {
        const value = this[TARGETS.input].value;

        if (!value.length) {
            this[TARGETS.hints].hidden = true;
        } else {
            const found = storage.historyStorage.getSortedCopyOfList()
                .filter(f => f.text.substr(0, value.length) === value);

            if (!found.length) {
                this[TARGETS.hints].hidden = true;
                return;
            }

            const html = document.createDocumentFragment();

            for (const item of found) {
                const props = {
                    class: HINT_ITEM_CLASS,
                    'data-text': item.text
                };

                html.appendChild(helpers.html('div', props, item.text));
            }

            this[TARGETS.hints].innerHTML = '';
            this[TARGETS.hints].appendChild(html);
            this[TARGETS.hints].hidden = false;
        }
    }

    onHintClick(event) {
        const target = event.target;

        if (target.classList.contains(HINT_ITEM_CLASS)) {
            event.stopPropagation();

            this[TARGETS.input].value = target.dataset.text;
            this[TARGETS.hints].hidden = true;

            this.onInputClick();
        }
    }

    onInputClick() {
        const value = this[TARGETS.input].value;
        if (!value) return;

        // TODO: stats os searching
        // TODO: add by second enter

        const now = Date.now();
        const cache = storage.historyStorage.get(value);

        // TODO: remove
        if (cache) {
            console.log('diff: ', (now - cache.timestamp));
            console.log('TIME_DAY: ', constants.TIME_DAY);
        }

        if (cache && (now - cache.timestamp) < constants.TIME_DAY) {
            storage.currentDict = cache;
            this.renderSheet(cache.data);
            return;
        }

        storage.dictionary.get(value).then(json => {
            const data = json.def || [];
            storage.currentDict = { text: value, data: data, timestamp: now };

            this.renderSheet(data);

            if (!cache) {
                this[TARGETS.addButton].disabled = false;
            } else {
                storage.historyStorage.update(storage.currentDict);
            }
        });
    }

    onAddClick(event) {
        if (storage.historyStorage.has(storage.currentDict.text)) return;
        event.stopPropagation();

        storage.historyStorage.add(storage.currentDict).then(list => {
            this[TARGETS.addButton].disabled = true;
            this.renderHistory(list);
            console.log(list.length);
        });
    }

    onHistoryClick(event) {
        const target = event.target;

        if (target.classList.contains('favorite-card')) {
            event.stopPropagation();

            const dict = storage.historyStorage.get(target.dataset.name);
            this.setDict(dict);
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
            : storage.historyStorage.read();

        promise.then(() => {
            const html = document.createDocumentFragment();
            const list = storage.historyStorage.list();
            list.reverse();

            this[TARGETS.history].innerHTML = '';

            for (const item of list) {
                html.appendChild((new FavoriteCard(item)).html());
            }

            this[TARGETS.history].appendChild(html);
        });
    }
}

module.exports = DictPage;
