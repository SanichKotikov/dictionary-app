'use strict';

/**
 * Helpers
 */
const helpers = {

    /**
     * Create DOM element
     * @param {string} tag
     * @param {Object} props
     * @param {string} text
     * @returns {HTMLElement}
     */
    html(tag, props = null, text = '') {
        const el = document.createElement(tag);

        if (props) {
            for (const key of Object.keys(props)) {
                el.setAttribute(key, props[key]);
            }
        }

        if (text) el.textContent = text;

        return el;
    },

    getRandom(min, max) {
        return parseInt(Math.random() * (max - min) + min, 10);
    }
};

module.exports = helpers;
