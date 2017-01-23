import { dictItem } from '../../scripts/interfaces';
import helpers from "../../scripts/helpers";
import constants from '../../scripts/constants';
import storage from '../../storages/storage';

import FavoriteStorage, { FavoriteStorageItem } from '../../storages/favorite-storege';
import FavoriteSetStorage from '../../storages/favorite-set-storage';

import LearnStart from '../../components/learn-start';
import LearnCard from '../../components/learn-card';


class App {

    private appEl: HTMLElement;
    private words: dictItem[];
    private card: LearnCard;
    private stat: any[];

    constructor() {
        this.appEl = document.getElementById('learn');
        this.words = [];

        storage.favorite = new FavoriteStorage(constants.FAVORITE_STORAGE_KEY);
        storage.favorite.read().then(() => this.renderStart());

        this.onSelectFavorite = this.onSelectFavorite.bind(this);
        this.nextCard = this.nextCard.bind(this);
    }

    private renderStart(): void {
        const favorites: FavoriteStorageItem[] = storage.favorite.getList();
        const learnStart = new LearnStart(favorites, this.onSelectFavorite);
        helpers.replaceHtml(this.appEl, learnStart.html, true);
    }

    private extractWord(): dictItem {
        if (!this.words.length) return null;

        const index = helpers.getRandom(0, this.words.length);
        const word: dictItem = this.words[index];
        this.words = this.words.filter((el: dictItem) => el.id !== word.id);

        return word;
    }

    private onSelectFavorite(id: number): void {
        const set = new FavoriteSetStorage(id);
        this.stat = [];

        set.read().then(() => {
            this.words = set.getList();
            this.card = new LearnCard(this.nextCard);
            return helpers.replaceHtml(this.appEl, this.card.html, true);
        }).then(() => {
            const word = this.extractWord();
            this.card.setState(word);
        });
    }

    private nextCard(result: any): void {
        this.stat.push(result);
        const word = this.extractWord();
        console.log(result);

        if (word !== null) {
            this.card.setState(word);
            return;
        }

        this.appEl.innerHTML = '';

        const correct = this.stat.filter(el => el.correct === true);
        const incorrect = this.stat.filter(el => el.correct === false);

        console.log(this.stat);
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
