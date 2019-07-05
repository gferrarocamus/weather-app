const form = document.querySelector('form');
const input = document.getElementById('search-term');
const results = document.getElementById('results');
const messages = document.getElementById('messages');
const message = document.getElementById('message');
const cross = document.getElementById('cross');

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

const convert = (value, unit) => {
  if (unit === 'C') return Math.round(((value - 32) * 5) / 9);
  if (unit === 'F') return Math.round((value * 9) / 5 + 32);
  return value;
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

  [title, icon, temp, minMax, description, more, wind, pressure, humidity].forEach((item) => {
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
  // unit === 'C' ? c.classList.add('active') : f.classList.add('active');
  div.appendChild(c);
  div.appendChild(f);
  parent.appendChild(div);
};

const fetchCities = (searchTerm) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=metric&appid=b8d08b4b5bc310505709e7342891ec46`,
    {
      mode: 'cors',
    },
  )
    .then(response => response.json())
    .then((response) => {
      if (response.cod === '404') {
        setText(`'${input.value}' was not found. Try again.`, message);
        clearAll();
        show(messages);
      } else {
        hide(messages);
        clearAll();
        addWeatherResults(response, results);
        addUnitToggler(results);
        show(results);
      }
    })
    .catch((error) => {
      setText(`Error: ${error}`, message);
      show(messages);
    });
};

form.addEventListener(
  'submit',
  (e) => {
    e.preventDefault();
    fetchCities(input.value);
  },
  false,
);

cross.addEventListener('click', () => hide(messages), false);
