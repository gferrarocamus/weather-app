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

const addWeatherResults = (response, unit, parent) => {
  const div = document.createElement('div');
  div.classList.add('card');
  const title = document.createElement('h2');
  const icon = document.createElement('img');
  const temp = document.createElement('big');
  const minMax = document.createElement('p');
  const description = document.createElement('h3');
  const more = document.createElement('h6');
  const wind = document.createElement('p');
  const pressure = document.createElement('p');
  const humidity = document.createElement('p');

  icon.src = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
  icon.alt = `${response.weather[0].description}`;

  let str = '';
  for (let i = 1; i < response.weather.length; i++) {
    i === 1 ? (str += 'with ') : (str += ', ');
    str += `${response.weather[i].description}`;
  }

  [
    [title, `${response.name}, ${response.sys.country}`],
    [temp, `${parseInt(response.main.temp)} °${unit}`],
    [
      minMax,
      `Min. ${parseInt(response.main.temp_min)} °${unit} | Max. ${parseInt(
        response.main.temp_max,
      )} °${unit}`,
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

const fetchCities = (searchTerm, unit) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=${unit}&appid=b8d08b4b5bc310505709e7342891ec46`,
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
        console.log(response);
        addWeatherResults(response, 'C', results);
        //addUnitToggler();
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
    fetchCities(input.value, 'metric');
  },
  false,
);

cross.addEventListener('click', () => hide(messages), false);
