const { BrowserWindow } = require('electron');

const onAddItemByLink = async (e, url) => {
	let offscreenWindow = new BrowserWindow({
		width: 500,
		height: 500,
		webPreferences: {
			offscreen: true,
		},
		show: false,
	});

	try {
		await offscreenWindow.loadURL(url);

		const title = offscreenWindow.getTitle();
		const capture = await offscreenWindow.webContents.capturePage();
		const screenshot = capture.toDataURL();

		offscreenWindow.close();
		offscreenWindow = null;

		return { url, title, screenshot, id: `${+Date.now()}` };
	} catch (error) {
		console.log(error);
		return null;
	}
};

module.exports = onAddItemByLink;
