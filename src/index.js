'use strict';

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const appMenu = require('./menus/main');
const trayMenu = require('./menus/tray');
const { getWindowPath } = require('./scripts/mainHelpers');

let mainWin = null;
// let learnWin = null;


function createMainWindow() {
    if (mainWin !== null) return;

    mainWin = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        show: false,
    });

    mainWin.loadURL(getWindowPath('main'));
    mainWin.once('ready-to-show', () => mainWin.show());

    openDevTools(mainWin);

    mainWin.on('close', event => onCloseMainWindow(event));
}

function onCloseMainWindow(event) {
    if (mainWin.forceClose) return;
    event.preventDefault();
    mainWin.hide();
}

// createLearnWindow() {
//     learnWin = new BrowserWindow({
//         width: 400,
//         height: 600,
//         resizable: false,
//         show: false,
//     });
//
//     learnWin.loadURL(getWindowPath('learn'));
//     learnWin.once('ready-to-show', () => win.show());
//
//     openDevTools(learnWin);
//
//     learnWin.on('closed', event => learnWin = null);
// }

function createMenus() {
    Menu.setApplicationMenu(appMenu);
    trayMenu(mainWin);
}

function openDevTools(win) {
    if (process.defaultApp) {
        win.webContents.openDevTools();
    }
}

app.on('window-all-closed', () => { /* Do nothing */ });
app.on('before-quit', () => mainWin.forceClose = true);
app.on('activate-with-no-open-windows', () => mainWin.show());

app.on('activate', (event, hasVisibleWindows) => {
    if (!hasVisibleWindows) mainWin.show();
});

app.on('ready', () => {
    createMainWindow();
    createMenus();
});
