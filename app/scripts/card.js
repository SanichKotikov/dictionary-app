'use strict';

class Card {

    constructor(dict) {
        this._dict = dict;

        // templates
        this._cardTpl = document.querySelector('template#card');
        this._titleTpl = document.querySelector('template#card-title');
        this._translateTpl = document.querySelector('template#card-tr');
    }

    _title() {
        const dict = this._dict;
        const el = document.importNode(this._titleTpl.content, true);
        const spans = el.querySelectorAll('span');

        spans[0].textContent = dict.text;

        if (dict.ts) {
            spans[1].textContent = `[${dict.ts}]`;
            spans[1].dataset.text = dict.text;
        }

        if (dict.pos) spans[2].textContent = dict.pos;

        return el;
    }

    _trItem(item) {
        const li = document.importNode(this._translateTpl.content, true);
        const divs = li.querySelectorAll('div');
        const syn = item.syn || [];

        divs[0].textContent = [{ text: item.text }, ...syn]
            .map(m => m.text).join(', ');

        // meanings
        if (item.mean && item.mean.length) {
            divs[1].textContent = `(${item.mean.map(m => m.text).join(', ')})`;
        }

        // examples with translation
        const exList = item.ex;
        const exHtmlList = [];

        if (exList && exList.length) {
            for (const ex of exList) {
                exHtmlList.push(`<li>${ex.text} – ${ex.tr[0].text}</li>`);
            }

            li.querySelector('ul').innerHTML = exHtmlList.join('\n');
        }

        return li;
    }

    html() {
        const html = document.importNode(this._cardTpl.content, true);
        const title = html.querySelector('.card-title');

        title.appendChild(this._title());

        const translations = html.querySelector('.card-translations');
        const trList = this._dict.tr;

        if (trList && trList.length) {
            for (const item of trList) {
                translations.appendChild(this._trItem(item));
            }
        }

        return html;
    }
}

module.exports = Card;
