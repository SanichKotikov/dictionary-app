'use strict';

class FavoriteCard {

    constructor(dict) {
        this._dict = dict;
        this._cardTpl = document.querySelector('template#favorite-card');
    }

    html() {
        const dict = this._dict;

        const html = document.importNode(this._cardTpl.content, true);
        const divs = html.querySelectorAll('.favorite-card > div');

        html.querySelector('.favorite-card').dataset.name = dict.text;

        divs[0].innerHTML = `${dict.text} <span class="transcription">[${dict.data[0].ts}]<span>`;
        divs[1].textContent = dict.data.map(item => item.tr[0].text).join(', ');

        return html;
    }
}

module.exports = FavoriteCard;
