const { Menu, shell } = require('electron');

module.exports = (webContents) => {
	let template = [
		{
			label: 'Items',
			submenu: [],
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
