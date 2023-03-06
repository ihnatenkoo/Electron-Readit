const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const mainWindowState = require('electron-window-state');
const path = require('path');
const onAddItem = require('./utils/onAddItem');

const createWindow = () => {
	let stateWin = mainWindowState({
		defaultWidth: 500,
		defaultHeight: 650,
	});

	const mainWindow = new BrowserWindow({
		x: stateWin.x,
		y: stateWin.y,
		width: stateWin.width,
		height: stateWin.height,
		minWidth: 350,
		maxWidth: 650,
		minHeight: 300,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	stateWin.manage(mainWindow);
	mainWindow.loadFile(path.join(__dirname, '/renderer/main.html'));
	Menu.setApplicationMenu(null);
	mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
	createWindow();
	ipcMain.handle('item:add', onAddItem);

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
