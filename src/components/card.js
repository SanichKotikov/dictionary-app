'use strict';

const constants = require('../scripts/constants');

class Card {

    constructor(dict, isTeaser = false) {
        this.dict = dict;
        this.isTeaser = isTeaser;

        // templates
        const templateID = isTeaser ? 'template#teaser-card' : 'template#card';

        this.cardTpl = document.querySelector(templateID);
        this.titleTpl = document.querySelector('template#card-title');
        this.translateTpl = document.querySelector('template#card-tr');
    }

    setTitle() {
        const dict = this.dict;
        const el = document.importNode(this.titleTpl.content, true);
        const spans = el.querySelectorAll('span');

        spans[0].textContent = dict.text;

        if (dict.ts) {
            spans[1].textContent = `[${dict.ts}]`;
            spans[1].dataset.text = dict.text;
        }

        if (dict.pos) spans[2].textContent = dict.pos;

        return el;
    }

    setTranslateItem(item) {
        const li = document.importNode(this.translateTpl.content, true);
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
        const dict = this.dict;
        const html = document.importNode(this.cardTpl.content, true);

        if (this.isTeaser) {
            const divs = html.querySelectorAll(`.${constants.TEASER_CARD_CLASS} > div`);
            html.querySelector(`.${constants.TEASER_CARD_CLASS}`).dataset.name = dict.id;

            divs[0].innerHTML = `${dict.id} <span class="transcription">[${dict.data[0].ts}]<span>`;
            divs[1].textContent = dict.data.map(item => item.tr[0].text).join(', ');
        } else {
            const title = html.querySelector('.card-title');
            title.appendChild(this.setTitle());

            const translations = html.querySelector('.card-translations');
            const trList = dict.tr;

            if (trList && trList.length) {
                for (const item of trList) {
                    translations.appendChild(this.setTranslateItem(item));
                }
            }
        }

        return html;
    }
}

module.exports = Card;
