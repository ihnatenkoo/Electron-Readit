const panel = document.createElement('div');
panel.className = 'panel-readit';

const panelCloseBtn = document.createElement('button');
panelCloseBtn.textContent = 'Close';
panelCloseBtn.className = 'close-readit';
panel.append(panelCloseBtn);

panelCloseBtn.addEventListener('click', (e) => {
	e.view.close();
});

const panelDeleteBtn = document.createElement('button');
panelDeleteBtn.textContent = 'Delete bookmark';
panelDeleteBtn.className = 'delete-readit';
panel.append(panelDeleteBtn);

panelDeleteBtn.addEventListener('click', (e) => {
	appItems.deleteItemFromReader('index');
	e.view.close();
});

document.getElementsByTagName('body')[0].append(panel);
