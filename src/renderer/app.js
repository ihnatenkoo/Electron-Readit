window.addEventListener('DOMContentLoaded', () => {
	const modal = document.querySelector('#modal');
	const showModalBtn = document.querySelector('#show-modal');
	const closeModalBtn = document.querySelector('#close-modal');
	const loadingError = document.querySelector('#loading-error');
	const addUrlInput = document.querySelector('#url');
	const addUrlBtn = document.querySelector('#add-item');
	const itemsBlock = document.querySelector('#items');

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
			loadingError.style.display = 'none';

			const item = await appItems.add(addUrlInput.value);

			if (item) {
				modal.style.display = 'none';
				addUrlInput.value = '';
				addUrlBtn.textContent = 'Add item';
				itemsBlock.innerHTML += `<h2>${item.title}</h2>`;
			} else {
				loadingError.style.display = 'block';
				addUrlBtn.textContent = 'Retry...';
			}
		}
	});

	addUrlInput.addEventListener('keyup', (e) => {
		if (e.key === 'Enter') addUrlBtn.click();
	});
});
