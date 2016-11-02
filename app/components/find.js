'use strict';

const constants = require('../scripts/constants');
const storage = require('../scripts/storage');
const helpers = require('../scripts/helpers');

const HINT_ITEM_CLASS = 'find-hint-item';

function renderHints(items) {
    const html = document.createDocumentFragment();

    for (const item of items) {
        const props = { class: HINT_ITEM_CLASS, 'data-text': item.text };
        html.appendChild(helpers.html('div', props, item.text));
    }

    return html;
}

class Find {

    constructor(onChange) {
        const tpl = document.querySelector('template#find');
        this.html = document.importNode(tpl.content, true);

        this.input = this.html.querySelector('#find-input');
        this.hints = this.html.querySelector('#find-hints');

        this.onChange = onChange || function() {};

        this.bindHandlers();
    }

    bindHandlers() {
        this.input.addEventListener('input', event => this.onInputChange(event));
        this.hints.addEventListener('click', event => this.onHintClick(event));

        this.input.addEventListener('keyup', event => {
            event.stopPropagation();

            if (event.keyCode === constants.ENTER_KEY_CODE) {
                this.hints.hidden = true;
                this.onEnter();
            }
        });
    }

    onInputChange() {
        const value = this.input.value;

        if (!value.length) {
            this.hints.hidden = true;
            return;
        }

        const found = storage.history.getSortedCopyOfList()
            .filter(f => f.text.substr(0, value.length) === value);

        if (!found.length) {
            this.hints.hidden = true;
            return;
        }

        this.hints.innerHTML = '';
        this.hints.appendChild(renderHints(found));
        this.hints.hidden = false;
    }

    onHintClick(event) {
        const target = event.target;

        if (target.classList.contains(HINT_ITEM_CLASS)) {
            event.stopPropagation();

            this.input.value = target.dataset.text;
            this.hints.hidden = true;

            this.onEnter();
        }
    }

    onEnter() {
        const value = this.input.value;
        if (!value) return;

        const now = Date.now();
        const cache = storage.history.get(value);

        if (cache && (now - cache.timestamp) < constants.TIME_DAY) {
            storage.currentDict = cache;
            this.onChange(cache.data, cache);
            return;
        }

        storage.dictionary.get(value).then(json => {
            const data = json.def || [];
            storage.currentDict = { text: value, data: data, timestamp: now };
            this.onChange(data, cache);
        });
    }

    updateText(text) {
        this.input.value = text || storage.currentDict.text;
    }
}

module.exports = Find;
