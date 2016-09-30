'use strict';

// app modules
const constants = require('./scripts/constants');
const YaDictionary = require('./api/ya.dictionary');
const Card = require('./scripts/card');


class App {

    constructor(appId) {
        // dom
        this._appEl = document.getElementById(appId || 'app');
        // this._codeEl = this._appEl.querySelector('code#code');
        this._dictInput = this._appEl.querySelector('input#dictionary-input');
        this._cardWr = this._appEl.querySelector('#card-wr');

        this.dictionary = new YaDictionary();
        this.bindEvents();
    }

    bindEvents() {
        this._dictInput.addEventListener('keyup', event => {
            if (event.keyCode === constants.ENTER_KEY_CODE) {
                this.onDictInputCkick();
            }
        });
    }

    onDictInputCkick() {
        const value = this._dictInput.value;
        if (!value) return;

        this.dictionary.get(value).then(json => {
            this.renderCards(json.def || []);
        });
    }

    renderCards(arr) {
        console.log(arr);
        this._cardWr.innerHTML = '';

        if (!arr.length) return;
        const html = document.createDocumentFragment();

        for (const item of arr) {
            html.appendChild((new Card(item)).html());
        }

        this._cardWr.appendChild(html);
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
