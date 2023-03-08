const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const mainWindowState = require('electron-window-state');
const path = require('path');
const onAddItem = require('./utils/onAddItem');
const fs = require('fs');

let readerWinIntegration;
fs.readFile(
	`${__dirname}/renderer/readerWin/readerWinIntegration.js`,
	(err, data) => {
		readerWinIntegration = data.toString();
	}
);
let readerWinIntegrationStyles;
fs.readFile(
	`${__dirname}/renderer/readerWin/readerWinIntegration.css`,
	(err, data) => {
		readerWinIntegrationStyles = data.toString();
	}
);

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

	ipcMain.on('open-reader', (e, url, id) => {
		let readWin = new BrowserWindow({
			webPreferences: {
				preload: path.join(__dirname, 'preload.js'),
			},
		});
		readWin.loadURL(url);
		readWin.webContents.executeJavaScript(
			readerWinIntegration.replace('index', id)
		);
		readWin.webContents.insertCSS(readerWinIntegrationStyles);
	});

	ipcMain.on('item:delete-from-reader', (e, index) => {
		mainWindow.webContents.send('item:delete-to-renderer', index);
	});
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
