import {UI} from './view.js';
import {URL} from './view.js';

UI.SEARCH.addEventListener('click', nowLocationWeather);
UI.LOCATION_ADD.addEventListener('click', addLocation);

function nowLocationWeather() {
	let cityName = document.querySelector('.city_search').value;
	const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
	const url = `${URL.WEATHER}?q=${cityName}&appid=${apiKey}&units=metric`;
	
	fetch(url)
	.then(response => response.json())
	.then(city => UI.WEATHER_IMG.src = `http://openweathermap.org/img/wn/${city.weather[0].icon}.png`);

	fetch(url)
	.then(response => response.json())
	.then(city => UI.LOCATION_NAME.textContent = (city.name));

	fetch(url)
	.then(response => response.json())
	.then(city => UI.LOCATION_TEMP.textContent = (Math.round(city.main.temp) + '°'))
	.catch(error => alert('City isn\'t found'));
}

function addLocation() {
	const newLocationItem = document.createElement('div');
	newLocationItem.classList.add('location');
	newLocationItem.textContent = UI.LOCATION_NAME.textContent;
	if(!UI.LOCATION_LIST.textContent.includes(newLocationItem.textContent)) UI.LOCATION_LIST.append(newLocationItem);
	newLocationItem.addEventListener('click', showWeather);

	createCross();
	function createCross() {
		const cross = document.createElement('button');
		cross.classList.add('cross');
		newLocationItem.append(cross);
		cross.addEventListener('click', deleteLocation);
	}
	
	function deleteLocation() {
		this.parentElement.remove();
	}
}

function showWeather() {
	let cityName = this.textContent;
	const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
	const url = `${URL.WEATHER}?q=${cityName}&appid=${apiKey}&units=metric`;

	fetch(url)
	.then(response => response.json())
	.then(city => UI.WEATHER_IMG.src = `http://openweathermap.org/img/wn/${city.weather[0].icon}.png`);

	fetch(url)
	.then(response => response.json())
	.then(city => UI.LOCATION_NAME.textContent = (city.name));

	fetch(url)
	.then(response => response.json())
	.then(city => UI.LOCATION_TEMP.textContent = (Math.round(city.main.temp) + '°'));
}