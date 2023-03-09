const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('appItems', {
	add: (item) => ipcRenderer.invoke('item:add', item),
	deleteItemFromReader: (index) =>
		ipcRenderer.send('item:delete-from-reader', index),
	deleteItemToRenderer: (callback) =>
		ipcRenderer.on('item:delete-to-renderer', callback),
	openReadWin: (url, id) => ipcRenderer.send('open-reader', url, id),
	openItemInReadWin: (callback) =>
		ipcRenderer.on('open-item-in-reader', callback),
	openModal: (callback) => ipcRenderer.on('open-modal', callback),
});
