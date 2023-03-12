import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');
let nameCountry;

const URL = 'https://restcountries.com/v3.1/name/';
function fetchCountries(name) {
    return fetch(`${URL+name}?fields=name,capital,population,flags,languages`)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  })
  .then(data => {
    return data;
  })
  .catch(error => {
    console.log('Error:', error)
  });
}

inputEl.addEventListener('input', debounce(() => {
  nameCountry = inputEl.value.trim();
  if (nameCountry!='') {
    fetchCountries(nameCountry)
    .then((country) => renderCountries(country))
    .catch((error) => Notiflix.Notify.failure("Oops, there is no country with that name"));
  }
  else {
    infoEl.innerHTML='';
    listEl.innerHTML='';
  }
},300));

function renderCountries(country) {
  infoEl.innerHTML='';
  listEl.innerHTML='';
  if (Number(country.length)===1) {
    createOneCountry(country[0]);
  }
  else if (Number(country.length)>=2 && Number(country.length)<=10) {
    for (let element in country) {
      createListCountries(element, country);
    }
  }
  else {
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");;
  }
};

function createOneCountry(country) {
  const informAbout = `<div class="info-container">
  <img src=${country.flags.svg} class="info-icon">
  <h1 class="title">${country.name.official}</h1>
  </div>
  <p class="about-country"><span class="struc-about">Capital:</span>${country.capital}</p>
  <p class="about-country"><span class="struc-about">Population:</span>${country.population}</p>
  <p class="about-country"><span class="struc-about">Languages:</span>${Object.values(country.languages).join(', ').toString()}</p>`;
  infoEl.insertAdjacentHTML('beforeend', informAbout);
};

function createListCountries(element, country) {
  const countryEl = `<li class="country-list-elem">
  <img src=${country[element].flags.svg} class="info-icon">
  <p class="county-list-name">${country[element].name.official}</p>
</li>`;
  infoEl.insertAdjacentHTML('beforeend', countryEl);
}