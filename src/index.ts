import { app, BrowserWindow, Menu } from 'electron';

import appMenu from './menus/main';
import trayMenu from './menus/tray';
import { getWindowPath } from './scripts/mainHelpers';

let mainWin: Electron.BrowserWindow = null;
let forceCloseMainWin: boolean = false;
let appTrayMenu: Electron.Tray = null;
let learnWin: Electron.BrowserWindow = null;


function createMainWindow(): void {
    if (mainWin !== null) return;

    mainWin = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        show: false,
    });

    mainWin.loadURL(getWindowPath('main'));
    mainWin.once('ready-to-show', () => mainWin.show());
    mainWin.on('close', event => onCloseMainWindow(event));
    openDevTools(mainWin);
}

function onCloseMainWindow(event: Electron.Event) {
    if (forceCloseMainWin) return;
    event.preventDefault();
    mainWin.hide();
}

function createLearnWindow(): void {
    learnWin = new BrowserWindow({
        width: 400,
        height: 600,
        resizable: false,
        show: false,
    });

    learnWin.loadURL(getWindowPath('learn'));
    learnWin.once('ready-to-show', () => learnWin.show());
    learnWin.on('closed', () => learnWin = null);
    openDevTools(learnWin);
}

function createMenus(): void {
    Menu.setApplicationMenu(appMenu);
    // must be set to variables
    appTrayMenu = trayMenu(mainWin, createLearnWindow);
}

function openDevTools(win: Electron.BrowserWindow): void {
    if (process.defaultApp) {
        win.webContents.openDevTools();
    }
}

app.on('window-all-closed', () => { /* Do nothing */ });
app.on('before-quit', () => forceCloseMainWin = true);
app.on('activate-with-no-open-windows', () => mainWin.show());

app.on('activate', (event: Electron.Event, hasVisibleWindows: boolean) => {
    if (!hasVisibleWindows) mainWin.show();
});

app.on('ready', () => {
    createMainWindow();
    createMenus();
});
