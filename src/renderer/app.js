window.addEventListener('DOMContentLoaded', () => {
	const showModalBtn = document.querySelector('#show-modal');
	const closeModalBtn = document.querySelector('#close-modal');
	const modal = document.querySelector('#modal');
	const addUrlInput = document.querySelector('#url');
	const addUrlBtn = document.querySelector('#add-item');

	showModalBtn.addEventListener('click', () => {
		modal.style.display = 'flex';
		addUrlInput.focus();
	});
	closeModalBtn.addEventListener('click', () => {
		modal.style.display = 'none';
	});

	addUrlBtn.addEventListener('click', () => {
		if (addUrlInput.value) console.log(addUrlInput.value);
	});

	addUrlInput.addEventListener('keyup', (e) => {
		if (e.key === 'Enter') addUrlBtn.click();
	});
});
