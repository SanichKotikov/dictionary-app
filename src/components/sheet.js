'use strict';

const Card = require('./card');
const helpers = require('../scripts/helpers');

class Sheet {

    constructor(cards = []) {
        this.html = helpers.html('div', { class: 'sheet-item' });

        for (const item of cards) {
            this.html.appendChild((new Card(item)).html());
        }

        this.bindHandlers();
    }

    bindHandlers() {
        this.html.addEventListener('click', event => this.onClick(event));
    }

    onClick(event) {
        const target = event.target;

        if (target.classList.contains('transcription')) {
            event.stopPropagation();

            var msg = new SpeechSynthesisUtterance(target.dataset.text);
            window.speechSynthesis.speak(msg);
        }
    }
}

module.exports = Sheet;
