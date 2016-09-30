'use strict';

const keys = require('../../keys');
const apiUrl = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup';

class YaDictionary {

    constructor() {
        if (!keys || !keys.yaDictionary) {
            throw new Error('Can\'t find dictionary key.');
        }

        const apiKey = keys.yaDictionary;
        const lang = 'en-ru'; // default

        this._url = `${apiUrl}?key=${apiKey}&lang=${lang}&text=`;
    }

    get(text) {
        const url = this._url + encodeURIComponent(text);

        return fetch(url).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log(response.status);
            }
        });
    }
}

module.exports = YaDictionary;
