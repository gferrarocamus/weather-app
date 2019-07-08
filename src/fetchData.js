import { renderErrorMsg, renderNotFoundMsg, renderResults } from './handleDOM';

const fetchData = (searchTerm) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=metric&appid=b8d08b4b5bc310505709e7342891ec46`;
  return fetch(url, { mode: 'cors' })
    .then(response => response.json())
    .catch(error => alert(`Error: ${error}`));
};

async function processData(searchTerm) {
  try {
    const response = await fetchData(searchTerm);
    response.cod === '404' ? renderNotFoundMsg() : renderResults(response);
  } catch (e) {
    renderErrorMsg(e);
  }
}

export { processData };
