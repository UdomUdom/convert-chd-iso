const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    convertSingle: (filePath, onLog) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('convert-single', filePath);

            ipcRenderer.on('convert-log', (_, msg) => onLog(msg));
            ipcRenderer.once('convert-done', () => resolve());
            ipcRenderer.once('convert-error', (_, err) => reject(err));
        });
    },

    selectFiles: () => ipcRenderer.invoke('select-files'),
    selectOutput: () => ipcRenderer.invoke('select-output-folder')
});