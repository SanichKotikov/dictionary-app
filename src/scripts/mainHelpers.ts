import { app } from 'electron';
import * as path from 'path';
import * as url from 'url';

const windowsPath: string = path.join(app.getAppPath(), 'src', 'windows');

export function getWindowPath(name): string {
    return url.format({
        pathname: path.join(windowsPath, name, 'index.html'),
        protocol: 'file:',
        slashes: true,
    })
}
