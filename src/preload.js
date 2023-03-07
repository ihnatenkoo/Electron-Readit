const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('appItems', {
	add: (item) => ipcRenderer.invoke('item:add', item),
	openReadWin: (url) => ipcRenderer.send('open-reader', url),
});
