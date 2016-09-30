'use strict';

/**
 * Helpers
 */
const helpers = {

    html(tag, props = null, text = '') {
        const el = document.createElement(tag);

        if (props) {
            for (const key of Object.keys(props)) {
                el.setAttribute(key, props[key]);
            }
        }

        if (text) el.textContent = text;

        return el;
    }
};

module.exports = helpers;
