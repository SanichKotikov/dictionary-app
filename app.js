'use strict';

const {
    app,
    BrowserWindow,
    Menu,
    Tray,
} = require('electron');

const path = require('path');
const NotificationCenter = require('node-notifier/notifiers/notificationcenter');

const constants = require('./app/scripts/constants');
const helpers = require('./app/scripts/helpers');
const FavoriteStorage = require('./app/scripts/favorite');

/**
 * Application
 */
class App {

    constructor() {
        this.win = null;
        this.tray = null;
        this.nc = null;

        this.createWindow();
        this.createTray();

        this.favStorage = new FavoriteStorage(constants.FAVORITE_STORAGE_KEY);
        this.runNotifying();
    }

    createWindow() {
        if (this.win !== null) return;

        const win = new BrowserWindow({
            width: 800,
            height: 600,
            resizable: false,
            show: false,
        });

        win.loadURL(`file://${__dirname}/app/index.html`);
        // win.webContents.openDevTools();
        win.once('ready-to-show', () => this.win.show());
        win.on('closed', () => this.win = null);

        this.win = win;
    }

    createTray() {
        const iconIdle = path.join(__dirname, 'images', 'tray.png');
        this.tray = new Tray(iconIdle);

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show Window',
                click: () => this.createWindow()
            },
            {
                label: 'Quit',
                click: () => app.quit()
            }
        ]);

        this.tray.setContextMenu(contextMenu);
    }

    // for testing...

    onNotifyClick(options) {
        const winIsNull = this.win === null;
        const dict = this.favStorage.get(options.title);

        if (!dict) return;

        this.createWindow();
        const content = this.win.webContents;
        const sendFn = () => content.send(constants.SHOW_DICT_EVENT, dict);

        console.log('winIsNull: ', winIsNull);

        if (winIsNull) {
            content.on('did-finish-load', () => sendFn());
        } else {
            sendFn();
        }
    }

    runNotifying() {
        const favStorage = new FavoriteStorage(constants.FAVORITE_STORAGE_KEY);

        this.nc = new NotificationCenter({ withFallback: false });
        this.nc.on('click', (notifierObject, options) => this.onNotifyClick(options));

        setInterval(() => {
            favStorage.read().then(() => {
                const list = favStorage.list();
                const index = helpers.getRandom(0, list.length);
                const dict = list[index];

                this.nc.notify({
                    title: dict.text,
                    subtitle: `[${dict.data[0].ts}]`,
                    message: dict.data.map(item => item.tr[0].text).join(', '),
                    // icon: path.join(__dirname, 'images', 'icon.png'),
                    sound: 'Glass',
                    wait: true,
                });
            });
        }, constants.TIME_HOUR / 2);
    }
}

app.on('ready', () => new App());
app.on('window-all-closed', () => { /* Do nothing */ });
