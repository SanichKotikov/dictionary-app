'use strict';

const helpers = require('./helpers');

class Card {

    constructor(dict) {
        this._dict = dict;
    }

    _title() {
        const d = this._dict;
        const el = helpers.html('div', { class: 'card-title' });

        el.appendChild(helpers.html('span', { class: 'card-title--text' }, `${d.text} `));
        if (d.ts) el.appendChild(helpers.html('span', { class: 'card-title--ts' }, `[${d.ts}] `));
        if (d.pos) el.appendChild(helpers.html('span', { class: 'card-title--pos' }, d.pos));

        return el;
    }

    static trItem(item) {
        const li = helpers.html('li', { class: 'card-translation-item' });
        const syn = item.syn || [];

        const title = helpers.html('div', { class: 'card-translation-item--title' });
        title.textContent = [{ text: item.text }, ...syn].map(m => m.text).join(', ');
        li.appendChild(title);

        if (item.mean && item.mean.length) {
            const mean = helpers.html('div', { class: 'card-translation-item--mean' });
            mean.textContent = `(${item.mean.map(m => m.text).join(', ')})`;
            li.appendChild(mean);
        }

        return li;
    }

    _trList() {
        const d = this._dict;
        const el = helpers.html('ol', { class: 'card-translations' });

        if (d.tr && d.tr.length) {
            for (const item of d.tr) {
                el.appendChild(Card.trItem(item));
            }
        }

        return el;
    }

    html() {
        const html = helpers.html('div', { class: 'card' });

        html.appendChild(this._title());
        html.appendChild(this._trList());

        return html;
    }
}

module.exports = Card;
