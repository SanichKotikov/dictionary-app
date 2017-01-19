'use strict';

const { app, Menu, Tray } = require('electron');
const path = require('path');
const iconIdle = path.join(__dirname, '..', '..', 'images', 'tray.png');

function trayMenu(mainWin) {
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show Window',
            click: () => mainWin.show()
        },
        {
            label: 'Quit',
            click: () => app.quit()
        }
    ]);

    const menu = new Tray(iconIdle);
    menu.setContextMenu(contextMenu);

    return menu;
}

module.exports = trayMenu;
