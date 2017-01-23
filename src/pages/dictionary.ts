import { remote } from 'electron';
const { Menu } = remote;

import Page from './page';
import Find from '../components/find';
import Card from '../components/card';
import Sheet from '../components/sheet';

import { dictItem } from '../scripts/interfaces';
import constants from '../scripts/constants';
import storage from '../storages/storage';
import helpers from '../scripts/helpers';

const TARGETS = {
    header: 'dict-header',
    sheet: 'dict-sheet',
    history: 'dict-history',
};


class DictPage extends Page {

    private findComp: Find;

    constructor(templateId: string) {
        super(templateId, TARGETS);

        this.findComp = new Find(this.onFindChange.bind(this));
        helpers.replaceHtml(this[TARGETS.header], this.findComp.html);

        if (storage.currentDict) {
            this.setDict();
        }

        this.bindHandlers();
        this.renderHistory();
    }

    private setDict(): void {
        this.findComp.updateText();
        this.renderSheet(storage.currentDict.data);
    }

    private bindHandlers(): void {
        this[TARGETS.history].addEventListener('click', event => this.onHistoryClick(event));
        this[TARGETS.history].addEventListener('contextmenu', event => this.onHistoryContext(event));
    }

    private onFindChange(dict: dictItem, cached: boolean): void {
        storage.currentDict = dict;
        this.renderSheet(dict.data);

        // TODO:
        if (!cached && dict.data.length) {
            this.renderHistory(storage.history.add(dict));
        } else {
            storage.history.update(dict);
        }
    }

    private onHistoryClick(event: Event): void {
        const target = <HTMLElement>event.target;

        if (target.classList.contains(constants.TEASER_CARD_CLASS)) {
            event.stopPropagation();

            storage.currentDict = storage.history.get(target.dataset['name']);
            this.setDict();
        }
    }

    private onHistoryContext(event: Event): void {
        const target = <HTMLElement>event.target;

        if (target.classList.contains(constants.TEASER_CARD_CLASS)) {
            event.stopPropagation();
            event.preventDefault();

            const menu = Menu.buildFromTemplate([{
                label: 'Delete',
                click: () => this.renderHistory(storage.history.remove(target.dataset['name']))
            }]);

            menu.popup(remote.getCurrentWindow());
        }
    }

    private renderSheet(cards: any[]): void {
        const sheet = new Sheet(cards);
        helpers.replaceHtml(this[TARGETS.sheet], sheet.html, true);
    }

    private renderHistory(promise: Promise<dictItem[]> = null): void {
        (promise || storage.history.read()).then(() => {
            const html = document.createDocumentFragment();
            const list: dictItem[] = storage.history.getList().reverse();

            for (const item of list) {
                html.appendChild((new Card(item, true)).html());
            }

            helpers.replaceHtml(this[TARGETS.history], html);
        });
    }
}

export default DictPage;
