import Card from './card';
import helpers from '../scripts/helpers';

class Sheet {

    public html: Element;

    constructor(cards: any[] = []) {
        this.html = helpers.html('div', { 'class': 'sheet-item' });

        for (const item of cards) {
            this.html.appendChild((new Card(item)).html());
        }

        this.bindHandlers();
    }

    private bindHandlers(): void {
        this.html.addEventListener('click', event => Sheet.onClick(event));
    }

    static onClick(event: Event): void {
        const target = <HTMLElement>event.target;

        if (target.classList.contains('transcription')) {
            event.stopPropagation();

            const msg = new SpeechSynthesisUtterance(target.dataset['text']);
            window.speechSynthesis.speak(msg);
        }
    }
}

export default Sheet;
