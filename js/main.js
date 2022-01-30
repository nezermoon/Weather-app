import {UI} from './view.js';

const favourites = JSON.parse(localStorage.getItem('favouriteCities')) || [];
const currentChosenCity = JSON.parse(localStorage.getItem('currentCity')) || [];

favourites.forEach(item => addWeather(item));
renderWeatherInfo(currentChosenCity);

function addWeather(cityName) {
	if(UI.LOCATION_LIST.textContent.indexOf(cityName) !== -1) return;
	const location = document.createElement('div');
	location.classList.add('location');
	location.textContent = `${cityName}`;
	UI.LOCATION_LIST.append(location);
	location.addEventListener('click', showCurrentFavourite);
	// create cross
	const cross = document.createElement('span');
	cross.classList.add('cross');
	location.append(cross);
	cross.addEventListener('click', removeFromFavourites);
}

const URLS = {
	WEATHER_NOW: 'http://api.openweathermap.org/data/2.5/weather',
	FORECAST: 'http://api.openweathermap.org/data/2.5/forecast',
	API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f',
}

renderForecastInfo();

UI.SEARCH.addEventListener('click', searchLocation);
UI.FAVOURITE_BUTTON.addEventListener('click', addToFavourites);

function convertTime(unixTime) {
	let date = new Date(unixTime * 1000);
	let hours = date.getHours();
	let minutes = "0" + date.getMinutes();
	return hours + ':' + minutes.slice(-2);
}

function convertForecastDay(value) {
	const date = new Date(value * 1000)
  return date.toLocaleString('en-US', {day: "numeric"}) + ' ' + date.toLocaleString('en-US', {month: "short"});
}

function renderWeatherInfo(city) {
	localStorage.setItem('currentCity', JSON.stringify(city));
	UI.LOCATION_NAME.textContent = city.name;
	UI.LOCATION_TEMP.textContent = Math.round(city.main.temp) + '°';
	UI.WEATHER_IMG.src = `http://openweathermap.org/img/wn/${city.weather[0].icon}.png`;
	UI.DETAILED_LOCATION_NAME.textContent = city.name;
	UI.DETAILED_TEMP.textContent = 'Temperature: ' + Math.round(city.main.temp) + '°';
	UI.DETAILED_FEEL.textContent = 'Feels like: ' + Math.round(city.main.feels_like) + '°';
	UI.DETAILED_WEATHER.textContent = 'Weather: ' + city.weather[0].main;
	UI.SUNRISE.textContent = 'Sunrise: ' + convertTime(city.sys.sunrise);
	UI.SUNSET.textContent = 'Sunset: ' + convertTime(city.sys.sunset);
	UI.FORECAST_LOCATION_NAME.textContent = city.name;
}

function searchLocation() {
	const cityName = UI.INPUT_TEXT.value;
	const url = `${URLS.WEATHER_NOW}?q=${cityName}&appid=${URLS.API_KEY}&units=metric`;
	fetch(url)
	.then(response => response.json())
	.then(renderWeatherInfo)
	.then(renderForecastInfo)
	.catch(error => alert('City isn\'t found'));
	
	UI.FORM.reset();
}

function showCurrentFavourite() {
	UI.INPUT_TEXT.value = this.textContent;
	searchLocation();
}

function addToFavourites() {
	if(UI.LOCATION_NAME.textContent === 'Location' || favourites.includes(UI.LOCATION_NAME.textContent) || UI.LOCATION_NAME.textContent === '') return;
	favourites.push(UI.LOCATION_NAME.textContent);
	favourites.forEach(city => addWeather(city));
	
	localStorage.setItem('favouriteCities', JSON.stringify(favourites));
}

function removeFromFavourites() {
	this.parentElement.remove();
	const index = favourites.indexOf(this.parentElement.textContent);
	if(index !== -1) {
		favourites.splice(index, 1);
	}
	if(!favourites.includes(this.parentElement.textContent)) localStorage.setItem('favouriteCities', JSON.stringify(favourites));
}

function renderForecastInfo() {
	UI.FORECAST_PAGE.textContent = '';
	const cityName = currentChosenCity.name;
	const url = `${URLS.FORECAST}?q=${cityName}&appid=${URLS.API_KEY}&units=metric`;
	fetch(url)
	.then(response => response.json())
	.then(city => city.list.forEach(item => {
		UI.FORECAST_HOUR.textContent = convertTime(item.dt);
		UI.FORECAST_DATE.textContent = convertForecastDay(item.dt);
		UI.FORECAST_TEMP.textContent = 'Temperature: ' + Math.round(item.main.temp) + '°';
		UI.FORECAST_FEELING.textContent = 'Feels like: ' + Math.round(item.main.feels_like) + '°';
		UI.FORECAST_WEATHER.textContent = item.weather[0].main;
		UI.FORECAST_IMG.src = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
		
		if(!UI.FORECAST_PAGE.hasChildNodes(UI.FORECAST_LOCATION_NAME.textContent))	UI.FORECAST_PAGE.append(UI.FORECAST_LOCATION_NAME);
		const forecastBlock = document.createElement('div');
		forecastBlock.classList.add('forecast_block');
		UI.FORECAST_PAGE.append(forecastBlock);

		const forecastTop = document.createElement('div');
		forecastTop.classList.add('forecast_top');
		forecastBlock.append(forecastTop);
		const forecastDate = document.createElement('span');
		forecastDate.classList.add('forecast_date');
		forecastDate.append(UI.FORECAST_DATE.textContent);
		const forecasteHour = document.createElement('span');
		forecasteHour.classList.add('forecast_hour');
		forecasteHour.append(UI.FORECAST_HOUR.textContent);
		forecastTop.append(forecastDate);
		forecastTop.append(forecasteHour);

		const forecastBottom = document.createElement('div');
		forecastBottom.classList.add('forecast_bottom');
		forecastBlock.append(forecastBottom);
		const forecastInfo = document.createElement('div');
		forecastInfo.classList.add('forecast_info');
		forecastBottom.append(forecastInfo);

		const forecastTemp = document.createElement('span');
		forecastTemp.classList.add('forecast_temp');
		forecastTemp.append(UI.FORECAST_TEMP.textContent);
		const forecasteFeeling = document.createElement('span');
		forecasteFeeling.classList.add('forecast_feeling');
		forecasteFeeling.append(UI.FORECAST_FEELING.textContent);
		forecastInfo.append(forecastTemp);
		forecastTemp.insertAdjacentHTML('afterend', '<br>');
		forecastInfo.append(forecasteFeeling);

		const forecastVisual = document.createElement('div');
		forecastVisual.classList.add('forecast_visual');
		const forecastWeather = document.createElement('div');
		forecastWeather.classList.add('forecast_weather');
		forecastWeather.append(UI.FORECAST_WEATHER.textContent);
		forecastVisual.append(forecastWeather);
		forecastBottom.append(forecastVisual);

		const img = document.createElement('img');
		img.classList.add('forecast_img');
		img.src = UI.FORECAST_IMG.src;
		forecastVisual.append(img);
	}));
}