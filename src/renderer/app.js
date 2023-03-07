window.addEventListener('DOMContentLoaded', () => {
	const modal = document.querySelector('#modal');
	const showModalBtn = document.querySelector('#show-modal');
	const closeModalBtn = document.querySelector('#close-modal');
	const loadingError = document.querySelector('#loading-error');
	const addUrlInput = document.querySelector('#url');
	const addUrlBtn = document.querySelector('#add-item');
	const itemsBlock = document.querySelector('#items');

	const addItemToMarkup = (item) => {
		itemsBlock.innerHTML += `<div class="read-item">
					<img src=${item.screenshot} alt="thumbnail" />
					<h2>${item.title}</h2>
				</div>`;
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
	};

	renderItems();

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
});
