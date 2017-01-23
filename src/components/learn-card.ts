import constants from '../scripts/constants';
import { dictItem } from '../scripts/interfaces';

class LearnCard {

    public html: HTMLElement;

    private wordEl: HTMLElement;
    private answerInput: HTMLInputElement;
    private nextButton: HTMLButtonElement;

    private item: dictItem;
    private translations: string[];

    constructor(private onNext: (any) => void) {
        const tpl = <HTMLTemplateElement>document.querySelector(`template#learn-card`);
        this.html = <HTMLElement>document.importNode(tpl.content, true);

        this.wordEl = <HTMLElement>this.html.querySelector('.word');
        this.answerInput = <HTMLInputElement>this.html.querySelector('input.answer');
        this.nextButton = <HTMLButtonElement>this.html.querySelector('button.next');

        this.bindEvents();
    }

    private bindEvents(): void {
        this.answerInput.addEventListener('keyup', event => this.onInputChange(event));
        this.nextButton.addEventListener('click', event => this.onNextClick());
    }

    private onInputChange(event: KeyboardEvent): void {
        if (event.keyCode === constants.ENTER_KEY_CODE) {
            this.onNextClick();
        }
    }

    private onNextClick(): void {
        const answer: string = this.answerInput.value.replace(/ё/g, 'е');
        console.log(answer);
        console.log(this.translations);

        this.onNext({
            id: this.item.id,
            correct: !!~this.translations.indexOf(answer)
        });
    }

    // TODO:
    private getTranslations(item: dictItem) {
        let translations: string[] = [];

        // TODO: add el.tr.syn[0].text
        item.data
            .map(el => el.tr.map(t => t.text))
            .forEach(el => translations = [...translations, ...el]);

        this.translations = translations;
    }

    public setState(item: dictItem): void {
        console.log(item);

        this.item = item;
        this.wordEl.textContent = item.id;
        this.answerInput.value = '';

        this.getTranslations(item);
    }
}

export default LearnCard;
