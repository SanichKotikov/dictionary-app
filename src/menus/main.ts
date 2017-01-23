import { Menu, app } from 'electron';

const viewSubMenu: Electron.MenuItemOptions[] = [
    {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
    },
];

if (process.defaultApp) {
    viewSubMenu.unshift({
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
            if (focusedWindow) focusedWindow.reload()
        }
    });
}

const template: Electron.MenuItemOptions[] = [
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
    const name: string = app.getName();

    template.unshift({
        label: name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'quit' },
        ]
    });
}

export default Menu.buildFromTemplate(template);
