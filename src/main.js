const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { execFile } = require('child_process');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

ipcMain.on('convert-single', (event, data) => {
    const { input, outputFolder } = data;

    if (!input || !outputFolder) {
        event.sender.send('convert-error', new Error('Missing paths'));
        return;
    }

    const { spawn } = require('child_process');
    const path = require('path');

    const chdmanPath = path.join(__dirname, '../tools/chdman.exe');

    const fileName = path.basename(input, '.chd');
    const output = path.join(outputFolder, fileName + '.iso');

    const process = spawn(chdmanPath, [
        'extracthd',
        '-i', input,
        '-o', output
    ]);

    process.stdout.on('data', (data) => {
        event.sender.send('convert-log', data.toString());
    });

    process.stderr.on('data', (data) => {
        event.sender.send('convert-log', data.toString());
    });

    process.on('close', (code) => {
        if (code === 0) {
            event.sender.send('convert-done');
        } else {
            event.sender.send('convert-error', new Error(`Exit code ${code}`));
        }
    });
});

ipcMain.handle('select-files', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'CHD Files', extensions: ['chd'] }]
    });

    return result.filePaths;
});

ipcMain.handle('select-output-folder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    return result.filePaths[0];
});