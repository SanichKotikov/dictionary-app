'use strict';

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const appMenu = require('./app/menus/main');
const trayMenu = require('./app/menus/tray');

/**
 * Application
 */
class App {

    constructor() {
        this.win = null;
        this.menu = null;
        this.tray = null;

        this.createWindow();
        this.createMenus();
    }

    createWindow() {
        if (this.win !== null) return;

        this.win = new BrowserWindow({
            width: 800,
            height: 600,
            resizable: false,
            show: false,
        });

        this.win.loadURL(`file://${__dirname}/app/index.html`);
        this.win.once('ready-to-show', () => this.win.show());

        // this.win.webContents.openDevTools();

        this.win.on('close', event => {
            if (this.win.forceClose) return;
            event.preventDefault();
            this.win.hide();
        });

        app.on('before-quit', () => this.win.forceClose = true);
        app.on('activate-with-no-open-windows', () => this.win.show());

        app.on('activate', (event, hasVisibleWindows) => {
            if (!hasVisibleWindows) this.win.show();
        });
    }

    createMenus() {
        this.menu = Menu.setApplicationMenu(appMenu);
        this.tray = trayMenu(this.win);
    }
}

app.on('ready', () => new App());
app.on('window-all-closed', () => { /* Do nothing */ });
