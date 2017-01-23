import { remote, webFrame } from 'electron';

import { PageOption, DictItem } from '../../scripts/interfaces';
import constants from '../../scripts/constants';
import storage from '../../storages/storage';
import helpers from '../../scripts/helpers';

import YaDictionary from '../../api/ya.dictionary';
import HistoryStorage from '../../storages/history-storage';
import FavoriteStorage from '../../storages/favorite-storege';
import Notifications from '../../scripts/notifications';

import DictPage from '../../pages/dictionary';
import FavoritePage from '../../pages/favorite';

const PAGES: PageOption[] = [
    {
        tplId: 'dict-page',
        title: 'dictionary',
        constructor: DictPage,
    },
    {
        tplId: 'favorite-page',
        title: 'favorite',
        constructor: FavoritePage,
    },
];


class App {

    private win: Electron.BrowserWindow;
    private appEl: HTMLElement;
    private aSide: HTMLElement;
    private pageEl: HTMLElement;

    constructor(appId: string = 'app') {
        this.win = remote.getCurrentWindow();

        // dom
        this.appEl = <HTMLElement>document.getElementById(appId);
        this.aSide = <HTMLElement>this.appEl.querySelector('#aside');
        this.pageEl = <HTMLElement>this.appEl.querySelector('#page');

        // storage
        storage.dictionary = new YaDictionary();
        storage.history = new HistoryStorage(constants.HISTORY_STORAGE_KEY);
        storage.favorite = new FavoriteStorage(constants.FAVORITE_STORAGE_KEY);
        storage.notifications = new Notifications(this.showDict.bind(this));

        // Disable pinch zoom
        webFrame.setVisualZoomLevelLimits(1, 1);

        this.renderPagesButtons();
        this.bindHandlers();

        // default page
        this.showPage(PAGES[0]);
    }

    private renderPagesButtons(): void {
        const html = document.createDocumentFragment();

        for (const page of PAGES) {
            const props = {
                title: page.title,
                'data-page': page.tplId
            };

            html.appendChild(helpers.html('button', props, page.title.substr(0, 1)));
        }

        helpers.replaceHtml(this.aSide, html);
    }

    private bindHandlers(): void {
        this.aSide.addEventListener('click', event => this.onAsideClick(event));
    }

    private showDict(dict: DictItem): void {
        storage.currentDict = dict;
        this.showPage(PAGES[0]); // TODO:

        if (!this.win.isVisible()) {
            this.win.show();
        }
    }

    private showPage(page: PageOption): void {
        const inst = new page.constructor(page.tplId);
        helpers.replaceHtml(this.pageEl, inst.html);
    }

    private onAsideClick(event: Event): void {
        const target = <HTMLElement>event.target;
        event.stopPropagation();

        if (target.dataset && target.dataset['page']) {
            const page = PAGES.find(p => p.tplId === target.dataset['page']);
            this.showPage(page);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
