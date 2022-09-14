import './css/styles.css';
// import fetchCountries from './fetchCountries.js';

const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
import Notiflix from 'notiflix';

// import debounce from 'lodash.debounce';

// var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const searchBoxEl = document.querySelector('#search-box');

searchBoxEl.addEventListener('input', onInput);

function onInput(event) {
  const nameInput = event.currentTarget.value.trim();
  fetchCountries(nameInput);
}

function fetchCountries(name) {
  if (name === '') {
    return;
  }
  fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length > 1 && data.length < 11) {
        renderCountryList(data);
        console.log(data);
      } else {
        renderCountryInfo(data);
        console.log(data);
      }
    })
    .catch(err => {
      console.log(err);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
          <img src="${country.flags.svg}" alt="flag" width="30">
          <span> ${country.name.official}</span>
          </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(country => {
      return `<h2><img src="${country.flags.svg}" alt="flag" width="50"> ${
        country.name.official
      }</h2>
<p><b>Capital: </b>${country.capital}</p>
<p><b>Population: </b>${country.population}</p>
<p><b>Languages: </b>${Object.values(country.languages)}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}
