import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';

const searchBoxEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
import Notiflix from 'notiflix';

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

searchBoxEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const nameInput = event.target.value.trim();
  if (nameInput === '') {
    countryInfoEl.innerHTML = '';
    countryListEl.innerHTML = '';
    return;
  }
  fetchCountries(nameInput)
    .then(data => {
      if (data.length > 10) {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length > 1 && data.length < 11) {
        countryInfoEl.innerHTML = '';
        renderCountryList(data);
        console.log(data);
      } else {
        countryListEl.innerHTML = '';
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
  countryListEl.innerHTML = markup;
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
  countryInfoEl.innerHTML = markup;
}
