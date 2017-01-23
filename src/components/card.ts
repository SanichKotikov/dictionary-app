import constants from '../scripts/constants';
// import { dictItemInterface } from '../storages/storage';

class Card {

    cardTpl: HTMLTemplateElement;
    titleTpl: HTMLTemplateElement;
    translateTpl: HTMLTemplateElement;

    constructor(public dictData: any, public isTeaser: boolean = false) {
        const templateID = isTeaser ? 'template#teaser-card' : 'template#card';

        this.cardTpl = <HTMLTemplateElement>document.querySelector(templateID);
        this.titleTpl = <HTMLTemplateElement>document.querySelector('template#card-title');
        this.translateTpl = <HTMLTemplateElement>document.querySelector('template#card-tr');
    }

    setTitle(): Element {
        const el = <Element>document.importNode(this.titleTpl.content, true);
        const spans = el.querySelectorAll('span');

        spans[0].textContent = this.dictData.text;

        if (this.dictData.ts) {
            spans[1].textContent = `[${this.dictData.ts}]`;
            spans[1].dataset['text'] = this.dictData.text;
        }

        if (this.dictData.pos) spans[2].textContent = this.dictData.pos;

        return el;
    }

    setTranslateItem(item): Element {
        const li = <Element>document.importNode(this.translateTpl.content, true);
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

    html(): Element {
        const dict = this.dictData;
        const html = <Element>document.importNode(this.cardTpl.content, true);

        if (this.isTeaser) {
            const divs = html.querySelectorAll(`.${constants.TEASER_CARD_CLASS} > div`);
            const teaserCard = <HTMLElement>html.querySelector(`.${constants.TEASER_CARD_CLASS}`);
            teaserCard.dataset['name'] = dict.id;

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

export default Card;
