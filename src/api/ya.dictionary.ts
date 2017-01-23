const keys = require('../../keys');
const apiUrl = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup';

class YaDictionary {

    private url: string;

    constructor() {
        if (!keys || !keys.yaDictionary) {
            throw new Error('Can\'t find dictionary key.');
        }

        const apiKey = keys.yaDictionary;
        const lang = 'en-ru'; // default

        this.url = `${apiUrl}?key=${apiKey}&lang=${lang}&text=`;
    }

    get(text) {
        const url = this.url + encodeURIComponent(text);

        return fetch(url).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log(response.status);
            }
        });
    }
}

export default YaDictionary;
