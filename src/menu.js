const { Menu, shell } = require('electron');

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
					label: 'Open item',
					accelerator: 'Enter',
					click: () => {
						webContents.send('open-item-in-reader');
					},
				},
				{
					label: 'Delete item',
					accelerator: 'Delete',
					click: () => {
						webContents.send('delete-item');
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
