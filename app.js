'use strict';

const {
    app,
    BrowserWindow,
    Menu,
    Tray,
} = require('electron');

const path = require('path');

/**
 * Application
 */
class App {

    constructor() {
        this.win = null;
        this.tray = null;

        this.createWindow();
        this.createTray();
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

    createTray() {
        const iconIdle = path.join(__dirname, 'images', 'tray.png');
        this.tray = new Tray(iconIdle);

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show Window',
                click: () => this.win.show()
            },
            {
                label: 'Quit',
                click: () => app.quit()
            }
        ]);

        this.tray.setContextMenu(contextMenu);
    }
}

app.on('ready', () => new App());
app.on('window-all-closed', () => { /* Do nothing */ });
