const helpers = {

    html(tag: string, props: any = null, text: string = ''): HTMLElement {
        const el: HTMLElement = document.createElement(tag);

        if (props) {
            for (const key of Object.keys(props)) {
                el.setAttribute(key, props[key]);
            }
        }

        if (text) el.textContent = text;

        return el;
    },

    replaceHtml(el: HTMLElement,
                content: HTMLElement | DocumentFragment,
                redraw: boolean = false): Promise<any> {
        el.innerHTML = '';

        return new Promise(resolve => {
            if (redraw === true) {
                setTimeout(() => {
                    el.appendChild(content);
                    resolve();
                }, 30)
            } else {
                el.appendChild(content);
                resolve();
            }
        })
    },

    getRandom(min: number, max: number): number {
        return parseInt((Math.random() * (max - min) + min).toString(), 10);
    }
};

export default helpers;
