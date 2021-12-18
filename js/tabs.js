import {UI} from './view.js';

UI.TABS.forEach(tab => {
	tab.addEventListener('click', addClassActive);
});

function addClassActive() {
	checkClassActive();
	this.classList.add('active');

	function checkClassActive() {
		UI.TABS.forEach(tab => {
		if(tab.classList.contains('active')) tab.classList.remove('active');
		})
	}
}