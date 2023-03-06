const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('appItems', {
	add: (item) => {
		ipcRenderer.invoke('items:add', item);
	},
});
