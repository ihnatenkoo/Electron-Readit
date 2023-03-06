const { BrowserWindow } = require('electron');

const onAddItem = async (e, url) => {
	let offscreenWindow = new BrowserWindow({
		width: 500,
		height: 500,
		webPreferences: {
			offscreen: true,
		},
		show: false,
	});

	await offscreenWindow.loadURL(url);

	const title = offscreenWindow.getTitle();
	const capture = await offscreenWindow.webContents.capturePage();
	const screenshot = capture.toDataURL();

	offscreenWindow.close();
	offscreenWindow = null;

	return { url, title, screenshot };
};

module.exports = onAddItem;
