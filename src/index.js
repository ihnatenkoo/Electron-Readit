const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const mainWindowState = require('electron-window-state');
const path = require('path');

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

const onAddItem = async (e, url) => {
	let offscreenWindow = new BrowserWindow({
		width: 500,
		height: 500,
		webPreferences: {
			offscreen: true,
		},
	});

	await offscreenWindow.loadURL(url);

	const title = offscreenWindow.getTitle();
	const capture = await offscreenWindow.webContents.capturePage();
	const screenshot = capture.toDataURL();

	offscreenWindow.close();
	offscreenWindow = null;

	return { url, title, screenshot };
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
