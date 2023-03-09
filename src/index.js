const { app, BrowserWindow, ipcMain } = require('electron');
const mainWindowState = require('electron-window-state');
const fs = require('fs');
const path = require('path');
const onAddItemByLink = require('./utils/onAddItemByLink');
const appMenu = require('./menu');

let mainWindow;

let readerWin;
fs.readFile(`${__dirname}/renderer/readerWin/readerWin.js`, (err, data) => {
	readerWin = data.toString();
});
let readerWinStyles;
fs.readFile(`${__dirname}/renderer/readerWin/readerWin.css`, (err, data) => {
	readerWinStyles = data.toString();
});

const createWindow = () => {
	let stateWin = mainWindowState({
		defaultWidth: 500,
		defaultHeight: 650,
	});

	mainWindow = new BrowserWindow({
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
	appMenu(mainWindow.webContents);
	mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
	createWindow();

	ipcMain.handle('item:add', onAddItemByLink);

	ipcMain.on('open-reader', (e, url, id) => {
		let readWin = new BrowserWindow({
			webPreferences: {
				preload: path.join(__dirname, 'preload.js'),
			},
		});
		readWin.setMenu(null);
		readWin.loadURL(url);
		readWin.webContents.executeJavaScript(readerWin.replace('id', id));
		readWin.webContents.insertCSS(readerWinStyles);
	});

	ipcMain.on('item:delete-from-reader', (e, id) => {
		mainWindow.webContents.send('item:delete-to-renderer', id);
	});

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
