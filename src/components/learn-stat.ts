import { learnAnswer } from '../scripts/interfaces';
import Card from '../components/card';


class LearnStat {

    public html: HTMLElement;
    private newButton: HTMLButtonElement;
    private repeatButton: HTMLButtonElement;

    constructor(private stat: learnAnswer[],
                private onNewClick: () => void,
                private onRepeat: () => void) {
        const tpl = <HTMLTemplateElement>document.querySelector('template#learn-stat');
        this.html = <HTMLElement>document.importNode(tpl.content, true);
        this.newButton = <HTMLButtonElement>this.html.querySelector('button.new');
        this.repeatButton = <HTMLButtonElement>this.html.querySelector('button.repeat');

        this.render();
        this.bindEvents();
    }

    private bindEvents(): void {
        this.newButton.addEventListener('click', event => this.onNewClick());
        this.repeatButton.addEventListener('click', event => this.onRepeat());
    }

    private render(): void {
        const wrongAnswers = this.stat.filter(el => el.correct === false);
        const resultEl = <HTMLElement>this.html.querySelector('.result');

        resultEl.textContent = `Correct: ${this.stat.length - wrongAnswers.length} :: Wrong: ${wrongAnswers.length}`;

        const wrongCardsEl = <HTMLElement>this.html.querySelector('.wrong-cards');

        for (const answer of wrongAnswers) {
            wrongCardsEl.appendChild((new Card(answer.dict, true)).html())
        }
    }
}

export default LearnStat;
