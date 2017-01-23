import { app, Menu, Tray } from 'electron';
import * as path from 'path';

const iconIdle: string = path.join(app.getAppPath(), 'images', 'tray.png');

function trayMenu(mainWin: Electron.BrowserWindow, createLearnWindow: () => void) {
    const contextMenu: Electron.Menu = Menu.buildFromTemplate([
        {
            label: 'Show Main Window',
            click: () => mainWin.show()
        },
        {
            label: 'Show Learn Window',
            click: () => createLearnWindow()
        },
        {
            label: 'Quit',
            click: () => app.quit()
        }
    ]);

    const menu: Electron.Tray = new Tray(iconIdle);
    menu.setContextMenu(contextMenu);

    return menu;
}

export default trayMenu;
