import helpers from '../scripts/helpers';
import { FavoriteStorageItem } from '../storages/favorite-storege';

const FAVORITE_ITEM_CLASS = 'favorite-item';

class LearnStart {

    public html: HTMLElement;

    constructor(favorites: FavoriteStorageItem[], public onSelect: (number) => void) {
        this.html = helpers.html('div', { 'class': 'learn-start' });
        const list = favorites.reverse();

        for (const item of list) {
            this.html.appendChild(helpers.html('div', {
                'class': FAVORITE_ITEM_CLASS,
                'data-id': item.id,
            }, item.name));
        }

        this.bindHandlers();
    }

    bindHandlers(): void {
        this.html.addEventListener('click', event => this.onClick(event));
    }

    onClick(event: MouseEvent): void {
        const target = <HTMLElement>event.target;

        if (target.classList.contains(FAVORITE_ITEM_CLASS)) {
            event.stopPropagation();

            const id: number = +target.dataset['id'];
            this.onSelect(id);
        }
    }
}

export default LearnStart;
