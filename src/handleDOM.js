import './css/style.css';
import { convert } from './utils';
import { processData } from './fetchData';

const form = document.querySelector('form');
const h1 = document.querySelector('h1.main');
const input = document.getElementById('search-term');
const results = document.getElementById('results');
const messages = document.getElementById('messages');
const message = document.getElementById('message');
const cross = document.getElementById('cross');
const clouds = document.querySelector('.cloud-container');

const show = (div) => {
  div.classList.remove('hide');
};

const hide = (div) => {
  div.classList.add('hide');
};

const setText = (msg, div) => {
  div.textContent = msg;
};

const clearAll = () => {
  input.value = '';
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
};

const toggleUnit = (e, unit) => {
  if ([...e.target.classList].indexOf('active') > -1) return;
  const currentTemp = document.getElementById('currentTemp');
  const minMax = document.getElementById('minMax');
  const current = currentTemp.textContent.split(' ')[0];
  const min = minMax.textContent.split(' ')[1];
  const max = minMax.textContent.split(' ')[5];
  [...document.getElementsByClassName('unit')].forEach((div) => {
    div.classList.toggle('active');
  });
  currentTemp.textContent = `${convert(current, unit)} °${unit}`;
  minMax.textContent = `Min. ${convert(min, unit)} °${unit} | Max. ${convert(max, unit)} °${unit}`;
};

const addWeatherResults = (response, parent) => {
  const div = document.createElement('div');
  div.classList.add('card');
  const title = document.createElement('h2');
  const date = document.createElement('p');
  date.classList.add('date');
  const icon = document.createElement('img');
  const temp = document.createElement('big');
  temp.setAttribute('id', 'currentTemp');
  const minMax = document.createElement('p');
  minMax.setAttribute('id', 'minMax');
  const description = document.createElement('h3');
  const more = document.createElement('h4');
  const wind = document.createElement('p');
  const pressure = document.createElement('p');
  const humidity = document.createElement('p');

  icon.src = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
  icon.alt = `${response.weather[0].description}`;

  let str = '';
  for (let i = 1; i < response.weather.length; i += 1) {
    i === 1 ? (str += 'with ') : (str += ', ');
    str += `${response.weather[i].description}`;
  }

  [
    [title, `${response.name}, ${response.sys.country}`],
    [
      date,
      `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} (${
        new Date().toString().split(' ')[5]
      })`,
    ],
    [temp, `${parseInt(response.main.temp)} °C`],
    [
      minMax,
      `Min. ${parseInt(response.main.temp_min)} °C | Max. ${parseInt(response.main.temp_max)} °C`,
    ],
    [description, `${response.weather[0].description}`],
    [more, `${str}`],
    [humidity, `Humidity: ${response.main.humidity} %`],
    [pressure, `Pressure: ${response.main.pressure} hpa`],
    [wind, `Wind: ${response.wind.speed} m/s`],
  ].forEach((item) => {
    item[0].textContent = item[1];
  });

  [date, title, icon, temp, minMax, description, more, wind, pressure, humidity].forEach((item) => {
    if (item.tagName === 'IMG' || item.textContent !== '') div.appendChild(item);
  });

  parent.appendChild(div);
};

const addUnitToggler = (parent) => {
  const div = document.createElement('div');
  div.classList.add('toggler');
  const c = document.createElement('div');
  c.textContent = '°C';
  c.value = 'C';
  c.classList.add('unit');
  c.classList.add('active');
  c.addEventListener('click', e => toggleUnit(e, 'C'), false);
  const f = document.createElement('div');
  f.value = 'F';
  f.textContent = '°F';
  f.classList.add('unit');
  f.addEventListener('click', e => toggleUnit(e, 'F'), false);
  div.appendChild(c);
  div.appendChild(f);
  parent.appendChild(div);
};

const renderErrorMsg = (error) => {
  alert(error);
  setText("That didn't work. Try again.", message);
  show(messages);
};

const renderNotFoundMsg = () => {
  setText(`'${input.value}' was not found. Try again.`, message);
  clearAll();
  show(messages);
};

const renderResults = (response) => {
  hide(messages);
  clearAll();
  addWeatherResults(response, results);
  addUnitToggler(results);
  hide(clouds);
  show(results);
};

const toggleCursor = () => {
  document.body.classList.toggle('busy-cursor');
};

h1.addEventListener('click', () => location.reload(), false);

cross.addEventListener('click', () => hide(messages), false);

form.addEventListener(
  'submit',
  (e) => {
    e.preventDefault();
    toggleCursor();
    processData(input.value);
  },
  false,
);

export { renderErrorMsg, renderNotFoundMsg, renderResults, toggleCursor };
