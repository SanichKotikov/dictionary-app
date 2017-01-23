import constants from '../scripts/constants';

import {
    dictItem,
    dictDataItem,
    dictDataTrItem,
    dictDataTrExItem,
    dictDataTrMeanItem,
    dictDataTrSynItem,
} from '../scripts/interfaces';


class Card {

    cardTpl: HTMLTemplateElement;
    titleTpl: HTMLTemplateElement;
    translateTpl: HTMLTemplateElement;

    constructor(public dict: dictItem | dictDataItem,
                public isTeaser: boolean = false) {

        const templateID = isTeaser ? 'template#teaser-card' : 'template#card';

        this.cardTpl = <HTMLTemplateElement>document.querySelector(templateID);
        this.titleTpl = <HTMLTemplateElement>document.querySelector('template#card-title');
        this.translateTpl = <HTMLTemplateElement>document.querySelector('template#card-tr');
    }

    setTitle(): Element {
        const dict = <dictDataItem>this.dict;
        const el = <Element>document.importNode(this.titleTpl.content, true);
        const spans = el.querySelectorAll('span');

        spans[0].textContent = dict.text;

        if (dict.ts) {
            spans[1].textContent = `[${dict.ts}]`;
            spans[1].dataset['text'] = dict.text;
        }

        if (dict.pos) spans[2].textContent = dict.pos;

        return el;
    }

    setTranslateItem(item: dictDataTrItem): Element {
        const li = <Element>document.importNode(this.translateTpl.content, true);
        const divs = li.querySelectorAll('div');
        const syn: dictDataTrSynItem[] = item.syn || [];

        divs[0].textContent = [{ text: item.text }, ...syn]
            .map(m => m.text).join(', ');

        // meanings
        if (item.mean && item.mean.length) {
            divs[1].textContent = `(${item.mean.map(m => m.text).join(', ')})`;
        }

        // examples with translation
        const exList: dictDataTrExItem[] = item.ex;
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
        const html = <Element>document.importNode(this.cardTpl.content, true);

        if (this.isTeaser) {
            const dict = <dictItem>this.dict;
            const divs = html.querySelectorAll(`.${constants.TEASER_CARD_CLASS} > div`);
            const teaserCard = <HTMLElement>html.querySelector(`.${constants.TEASER_CARD_CLASS}`);
            teaserCard.dataset['name'] = dict.id;

            divs[0].innerHTML = `${dict.id} <span class="transcription">[${dict.data[0].ts}]<span>`;
            divs[1].textContent = dict.data.map(item => item.tr[0].text).join(', ');
        } else {
            const dict = <dictDataItem>this.dict;
            const title = html.querySelector('.card-title');
            title.appendChild(this.setTitle());

            const translations = html.querySelector('.card-translations');
            const trList: dictDataTrItem[] = dict.tr;

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
