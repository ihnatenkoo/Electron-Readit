window.addEventListener('DOMContentLoaded', () => {
	const modal = document.querySelector('#modal');
	const showModalBtn = document.querySelector('#show-modal');
	const closeModalBtn = document.querySelector('#close-modal');
	const loadingError = document.querySelector('#loading-error');
	const addUrlInput = document.querySelector('#url');
	const addUrlBtn = document.querySelector('#add-item');
	const itemsBlock = document.querySelector('#items');
	const searchInput = document.querySelector('#search');

	const addItemToMarkup = (item) => {
		const readItem = document.createElement('div');
		readItem.className = 'read-item';
		readItem.setAttribute('data-url', item.url);
		readItem.setAttribute('data-id', item.id);

		readItem.innerHTML = `
				<img src=${item.screenshot} alt="thumbnail" />
				<h2>${item.title}</h2>
			`;

		readItem.addEventListener('click', (e) => {
			const activeEl = document.getElementsByClassName('read-item active')[0];
			if (activeEl) activeEl.classList.remove('active');
			e.currentTarget.classList.add('active');
		});

		itemsBlock.appendChild(readItem);
	};

	const renderItems = (newItem) => {
		const savedItems = JSON.parse(localStorage.getItem('readit-items')) ?? [];

		if (newItem) {
			savedItems.push(newItem);
			localStorage.setItem('readit-items', JSON.stringify(savedItems));
			addItemToMarkup(newItem);

			return;
		}

		savedItems.forEach((item) => {
			addItemToMarkup(item);
		});

		const readItems = document.getElementsByClassName('read-item');
		if (readItems.length) {
			readItems[0].classList.add('active');
		}
	};

	renderItems();

	document.addEventListener('keydown', (e) => {
		let activeReadItem = document.getElementsByClassName('read-item active')[0];

		if (e.key === 'ArrowUp' && activeReadItem.previousElementSibling) {
			activeReadItem.classList.remove('active');
			activeReadItem.previousElementSibling.classList.add('active');
		}
		if (e.key === 'ArrowDown' && activeReadItem.nextElementSibling) {
			activeReadItem.classList.remove('active');
			activeReadItem.nextElementSibling.classList.add('active');
		}
	});

	searchInput.addEventListener('keyup', (event) => {
		Array.from(document.querySelectorAll('.read-item')).forEach((item) => {
			const hasMatch = item.textContent
				.toLowerCase()
				.includes(searchInput.value.toLowerCase());

			item.style.display = hasMatch ? 'flex' : 'none';
		});
	});

	showModalBtn.addEventListener('click', () => {
		modal.style.display = 'flex';
		addUrlInput.focus();
	});
	closeModalBtn.addEventListener('click', () => {
		modal.style.display = 'none';
		addUrlBtn.textContent = 'Add item';
		loadingError.style.display = 'none';
		addUrlInput.value = '';
	});

	addUrlBtn.addEventListener('click', async () => {
		if (addUrlInput.value) {
			addUrlBtn.textContent = 'Loading...';
			addUrlBtn.disabled = true;
			loadingError.style.display = 'none';

			const item = await appItems.add(addUrlInput.value);

			if (item) {
				modal.style.display = 'none';
				addUrlInput.value = '';
				addUrlBtn.textContent = 'Add item';
				addUrlBtn.disabled = false;
				renderItems(item);
			} else {
				loadingError.style.display = 'block';
				addUrlBtn.textContent = 'Retry...';
				addUrlBtn.disabled = false;
			}
		}
	});

	addUrlInput.addEventListener('keyup', (e) => {
		if (e.key === 'Enter') addUrlBtn.click();
	});

	itemsBlock.addEventListener('dblclick', (e) => {
		if (e.target && e.target.classList.contains('read-item')) {
			const url = e.target.dataset.url;
			const id = e.target.dataset.id;
			appItems.openReadWin(url, id);
		}
	});

	appItems.deleteItemToRenderer((_event, index) => {
		const savedItems = JSON.parse(localStorage.getItem('readit-items')) ?? [];
		const filtered = savedItems.filter((i) => i.id !== index);

		localStorage.setItem('readit-items', JSON.stringify(filtered));
		itemsBlock.innerHTML = '';
		renderItems();
	});
});
