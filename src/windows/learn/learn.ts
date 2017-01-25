import { DictItem, learnAnswer } from '../../scripts/interfaces';
import helpers from "../../scripts/helpers";
import constants from '../../scripts/constants';
import storage from '../../storages/storage';
import LearnLogger from '../../storages/learn-logger';

import FavoriteStorage, { FavoriteStorageItem } from '../../storages/favorite-storege';
import FavoriteSetStorage from '../../storages/favorite-set-storage';

import LearnStart from '../../components/learn-start';
import LearnCard from '../../components/learn-card';
import LearnStat from '../../components/learn-stat';


class App {

    private appEl: HTMLElement;
    private words: DictItem[];
    private card: LearnCard;
    private stat: learnAnswer[];
    private learnLogger: LearnLogger;

    constructor() {
        this.appEl = document.getElementById('learn');
        this.words = [];

        storage.favorite = new FavoriteStorage(constants.FAVORITE_STORAGE_KEY);
        storage.favorite.read().then(() => this.renderStart());
        this.learnLogger = new LearnLogger();

        this.renderStart = this.renderStart.bind(this);
        this.onSelectFavorite = this.onSelectFavorite.bind(this);
        this.startLearn = this.startLearn.bind(this);
        this.nextCard = this.nextCard.bind(this);
    }

    private renderStart(): void {
        const favorites: FavoriteStorageItem[] = storage.favorite.getList();
        const learnStart = new LearnStart(favorites, this.onSelectFavorite);
        helpers.replaceHtml(this.appEl, learnStart.html, true);
    }

    private extractWord(): DictItem {
        if (!this.words.length) return null;

        const index = helpers.getRandom(0, this.words.length);
        const word: DictItem = this.words[index];
        this.words = this.words.filter((el: DictItem) => el.id !== word.id);

        return word;
    }

    private onSelectFavorite(id: number): void {
        storage.currentFavorite = new FavoriteSetStorage(id);
        this.startLearn();
    }

    private startLearn(): void {
        this.stat = [];

        storage.currentFavorite.read().then(() => {
            this.words = storage.currentFavorite.getList();
            this.card = new LearnCard(this.nextCard);
            return helpers.replaceHtml(this.appEl, this.card.html, true);
        }).then(() => {
            const word = this.extractWord();
            this.card.setState(word);
        });
    }

    private nextCard(result: learnAnswer): void {
        if (!result.correct) {
            this.learnLogger.increment(result.dict.id);
        }

        this.stat.push(result);
        const word = this.extractWord();

        if (word !== null) {
            this.card.setState(word);
        } else {
            this.showStat();
        }
    }

    private showStat(): void {
        const learnStat = new LearnStat(this.stat, this.renderStart, this.startLearn);
        helpers.replaceHtml(this.appEl, learnStat.html, true);
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
