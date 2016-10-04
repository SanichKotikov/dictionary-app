'use strict';

class FavoriteCard {

    constructor(dict) {
        this._dict = dict;
        this._cardTpl = document.querySelector('template#favorite-card');
    }

    html() {
        const dist = this._dict;

        const html = document.importNode(this._cardTpl.content, true);
        const divs = html.querySelectorAll('.favorite-card > div');

        html.querySelector('.favorite-card').dataset.name = dist.text;

        divs[0].innerHTML = `${dist.text} <span class="transcription">[${dist.data[0].ts}]<span>`;
        divs[1].textContent = dist.data.map(item => item.tr[0].text).join(', ');

        return html;
    }
}

module.exports = FavoriteCard;
