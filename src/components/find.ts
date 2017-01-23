import { dictItem } from '../scripts/interfaces';
import constants from '../scripts/constants';
import storage from '../storages/storage';
import helpers from '../scripts/helpers';

const HINT_ITEM_CLASS = 'find-hint-item';


function renderHints(items: dictItem[]): DocumentFragment {
    const html: DocumentFragment = document.createDocumentFragment();

    for (const item of items) {
        const props = { 'class': HINT_ITEM_CLASS, 'data-text': item.id };
        html.appendChild(helpers.html('div', props, item.id));
    }

    return html;
}


class Find {

    html: Element;
    input: HTMLInputElement;
    hints: HTMLElement;

    constructor(public onChange: (dict: dictItem, cached: boolean) => void,
                placeholder: string = 'Search') {
        const tpl = <HTMLTemplateElement>document.querySelector('template#find');
        this.html = <Element>document.importNode(tpl.content, true);

        this.input = <HTMLInputElement>this.html.querySelector('#find-input');
        this.input.placeholder = placeholder;
        this.hints = <HTMLElement>this.html.querySelector('#find-hints');

        this.onChange = onChange || function() {};

        this.bindHandlers();
    }

    private bindHandlers(): void {
        this.input.addEventListener('input', event => this.onInputChange());
        this.hints.addEventListener('click', event => this.onHintClick(event));

        this.input.addEventListener('keyup', event => {
            event.stopPropagation();

            if (event.keyCode === constants.ENTER_KEY_CODE) {
                this.hints.hidden = true;
                this.onEnter();
            }
        });
    }

    private onInputChange(): void {
        const value = this.input.value;

        if (!value.length) {
            this.hints.hidden = true;
            return;
        }

        const found = storage.history.getSortedCopyOfList()
            .filter(f => f.id.substr(0, value.length) === value)
            .slice(0, 10);

        if (!found.length) {
            this.hints.hidden = true;
            return;
        }

        helpers.replaceHtml(this.hints, renderHints(found));
        this.hints.hidden = false;
    }

    private onHintClick(event: Event): void {
        const target = <HTMLElement>event.target;

        if (target.classList.contains(HINT_ITEM_CLASS)) {
            event.stopPropagation();

            this.input.value = target.dataset['text'];
            this.hints.hidden = true;

            this.onEnter();
        }
    }

    private onEnter(): void {
        const value = this.input.value;
        if (!value) return;

        const now = Date.now();
        const cache = storage.history.get(value);

        if (cache && (now - cache.timestamp) < constants.TIME_DAY) {
            this.onChange(cache, !!cache);
            return;
        }

        storage.dictionary.get(value).then(json => {
            const dict: dictItem = { id: value, data: json.def || [], timestamp: now };
            this.onChange(dict, !!cache);
        });
    }

    public updateText(text?: string): void {
        this.input.value = (text !== null && text !== undefined) ? text : storage.currentDict.id;
    }
}

export default Find;
