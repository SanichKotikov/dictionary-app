'use strict';

class Page {

    constructor(templateId, targets) {
        const tpl = document.querySelector(`template#${templateId}`);
        this.html = document.importNode(tpl.content, true);

        for (const key of Object.keys(targets)) {
            const target = targets[key];
            this[target] = this.html.querySelector(`#${target}`);
        }
    }
}

module.exports = Page;
