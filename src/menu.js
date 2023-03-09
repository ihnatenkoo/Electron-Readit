const { Menu, shell, ipcMain } = require('electron');

module.exports = (webContents) => {
	let template = [
		{
			label: 'Items',
			submenu: [
				{
					label: 'Add new',
					accelerator: 'CmdOrCtrl + O',
					click: () => {
						webContents.send('open-modal');
					},
				},
				{
					label: 'Open',
					accelerator: 'CmdOrCtrl + Enter',
					click: () => {
						webContents.send('open-item-in-reader');
					},
				},
				{
					label: 'Open in Browser',
					accelerator: 'CmdOrCtrl + Shift + Enter',
					click: () => {
						webContents.send('open-in-native-browser');
						ipcMain.on('id-to-native-browser', (_e, url) =>
							shell.openExternal(url)
						);
					},
				},
				{
					label: 'Delete item',
					accelerator: 'Delete',
					click: () => {
						webContents.send('delete-item');
					},
				},
				{
					label: 'Search item',
					accelerator: 'CmdOrCtrl + S',
					click: () => {
						webContents.send('search-item');
					},
				},
			],
		},
		{ role: 'editMenu' },
		{ role: 'windowMenu' },
		{
			role: 'help',
			submenu: [
				{
					label: 'Learn more',
					click: () => {
						shell.openExternal('https://github.com/ihnatenkoo/Electron-Readit');
					},
				},
			],
		},
	];

	if (process.platform === 'darwin') template.unshift({ role: 'appMenu' });

	const menu = Menu.buildFromTemplate(template);

	Menu.setApplicationMenu(menu);
};
