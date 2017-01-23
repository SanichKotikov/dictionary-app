class Page {

    public html: Element;

    constructor(templateId: string, targets: any) {
        const tpl: HTMLTemplateElement = <HTMLTemplateElement>document.querySelector(`template#${templateId}`);
        this.html = <Element>document.importNode(tpl.content, true);

        for (const key of Object.keys(targets)) {
            const target: string = targets[key];
            this[target] = this.html.querySelector(`#${target}`);
        }
    }
}

export default Page;
