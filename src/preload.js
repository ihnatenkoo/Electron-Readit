const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('appItems', {
	add: (item) => ipcRenderer.invoke('item:add', item),
	deleteItemFromReader: (index) =>
		ipcRenderer.send('item:delete-from-reader', index),
	deleteItemToRenderer: (callback) =>
		ipcRenderer.on('item:delete-to-renderer', callback),
	openReadWin: (url, id) => ipcRenderer.send('open-reader', url, id),
});

contextBridge.exposeInMainWorld('appMenu', {
	openItemInReadWin: (callback) =>
		ipcRenderer.on('open-item-in-reader', callback),
	openModal: (callback) => ipcRenderer.on('open-modal', callback),
	deleteItem: (callback) => ipcRenderer.on('delete-item', callback),
	searchItem: (callback) => ipcRenderer.on('search-item', callback),
	openInNativeBrowser: (callback) =>
		ipcRenderer.on('open-in-native-browser', callback),
	getUrlToNativeBrowser: (url) => ipcRenderer.send('id-to-native-browser', url),
});
