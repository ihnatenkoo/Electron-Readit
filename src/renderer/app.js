window.addEventListener('DOMContentLoaded', () => {
	const modal = document.querySelector('#modal');
	const showModalBtn = document.querySelector('#show-modal');
	const closeModalBtn = document.querySelector('#close-modal');
	const loadingError = document.querySelector('#loading-error');
	const addUrlInput = document.querySelector('#url');
	const addUrlBtn = document.querySelector('#add-item');
	const itemsBlock = document.querySelector('#items');
	const searchInput = document.querySelector('#search');
	const clearSearchInput = document.querySelector('.clear-search');

	const getActiveItem = () => {
		return document.querySelector('.read-item.active');
	};

	const deleteItem = (id) => {
		const savedItems = JSON.parse(localStorage.getItem('readit-items')) ?? [];
		const filtered = savedItems.filter((i) => i.id !== id);
		localStorage.setItem('readit-items', JSON.stringify(filtered));
		itemsBlock.innerHTML = '';
		renderItems();
	};

	const addItem = (item) => {
		const readItem = document.createElement('div');
		readItem.className = 'read-item';
		readItem.setAttribute('data-url', item.url);
		readItem.setAttribute('data-id', item.id);

		readItem.innerHTML = `
				<img src=${item.screenshot} alt="thumbnail" />
				<h2>${item.title}</h2>
				<button class="readit-delete">Delete</button>
			`;

		readItem.addEventListener('click', (e) => {
			const activeEl = getActiveItem();
			if (activeEl) activeEl.classList.remove('active');
			e.currentTarget.classList.add('active');

			if (e.target.classList.contains('readit-delete')) {
				deleteItem(e.currentTarget.dataset.id);
			}
		});

		itemsBlock.appendChild(readItem);
	};

	const renderItems = (newItem) => {
		const savedItems = JSON.parse(localStorage.getItem('readit-items')) ?? [];

		if (newItem) {
			savedItems.push(newItem);
			localStorage.setItem('readit-items', JSON.stringify(savedItems));

			addItem(newItem);

			if (savedItems.length === 1)
				document.querySelector('.read-item').classList.add('active');

			return;
		}

		savedItems.forEach((item) => {
			addItem(item);
		});

		const readItems = document.getElementsByClassName('read-item');
		if (readItems.length) {
			readItems[0].classList.add('active');
		}
	};

	renderItems();

	document.addEventListener('keydown', (e) => {
		let activeReadItem = getActiveItem();

		if (
			e.key === 'ArrowUp' &&
			activeReadItem &&
			activeReadItem.previousElementSibling
		) {
			activeReadItem.classList.remove('active');
			activeReadItem.previousElementSibling.classList.add('active');
		}
		if (
			e.key === 'ArrowDown' &&
			activeReadItem &&
			activeReadItem.nextElementSibling
		) {
			activeReadItem.classList.remove('active');
			activeReadItem.nextElementSibling.classList.add('active');
		}
	});

	searchInput.addEventListener('keyup', () => {
		clearSearchInput.style.display = searchInput.value ? 'block' : 'none';
		document.querySelectorAll('.read-item').forEach((item) => {
			const hasMatch = item
				.querySelector('h2')
				.textContent.toLowerCase()
				.includes(searchInput.value.toLowerCase());
			item.style.display = hasMatch ? 'flex' : 'none';
		});
	});

	clearSearchInput.addEventListener('click', () => {
		searchInput.value = '';
		clearSearchInput.style.display = 'none';
		document.querySelectorAll('.read-item').forEach((item) => {
			item.style.display = 'flex';
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

	appItems.deleteItemToRenderer((_event, id) => {
		deleteItem(id);
	});

	appMenu.openModal((_event) => {
		showModalBtn.click();
	});

	appMenu.openItemInReadWin((_event) => {
		const activeItem = getActiveItem();
		const url = activeItem.dataset.url;
		const id = activeItem.dataset.id;
		appItems.openReadWin(url, id);
	});

	appMenu.deleteItem((_event) => {
		const activeItem = getActiveItem();
		const id = activeItem.dataset.id;
		deleteItem(id);
	});

	appMenu.searchItem((_event) => {
		searchInput.focus();
	});
});
