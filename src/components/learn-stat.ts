import { learnAnswer } from '../scripts/interfaces';
import Card from '../components/card';


class LearnStat {

    public html: HTMLElement;

    constructor(private stat: learnAnswer[]) {
        const tpl = <HTMLTemplateElement>document.querySelector('template#learn-stat');
        this.html = <HTMLElement>document.importNode(tpl.content, true);

        this.render();
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
