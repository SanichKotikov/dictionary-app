'use strict';

const { Menu, app } = require('electron');

const viewSubMenu = [
    {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
    },
];

if (process.defaultApp) {
    viewSubMenu.unshift({
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
        }
    });
}

const template = [
    // Edit Menu
    {
        label: 'Edit',
        submenu: [
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectall' },
        ]
    },
    // View Menu
    {
        label: 'View',
        submenu: viewSubMenu
    },
];

// OSX
if (process.platform === 'darwin') {
    const name = app.getName();

    template.unshift({
        label: name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'quit' },
        ]
    });
}

module.exports = Menu.buildFromTemplate(template);
