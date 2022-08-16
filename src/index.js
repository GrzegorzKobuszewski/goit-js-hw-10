import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// FUNKCJE
// Dodadanie pustych gałęzi do drzewa DOM (a właściwie wyczyszczenie danych kraju)
function clearCountryData() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}

// Wyszukiwanie określonego elementu - kraju
function searchCountry(e) {
    const countryToFind = e.target.value.trim();
    if (!countryToFind) {
        clearAtrributes();
        return;
    }

    fetchCountries(countryToFind)
        .then(country => {
            if (country.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                clearCountryData();
                return;
            } else if (country.length === 1) {
                clearCountryData(countryList.innerHTML);
                renderCountryInfo(country);
            } else if ((country.length > 1) && (country.length <= 10)){
                clearCountryData(countryInfo.innerHTML);
                renderCountryList(country);
            }
        })
        .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
            clearCountryData();
            return error;
        });
}

// Przetwarzanie
function renderCountryList(country) {
    const markup = country
        .map(({ name, flags }) => {
            return `<li><img src="${flags.svg}" alt="${name.official}" width="100" height="60">${name.official}</li>`;
        })
        .join('');
    countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
    const markupInfo = country
        .map(({ name, capital, population, flags, languages }) => {
            return `<h1><img src="${flags.svg}" alt="${
                name.official
            }" width="100" height="60">${name.official}</h1>
            <p><span>Capital: </span>${capital}</p>
            <p><span>Population:</span> ${population}</p>
            <p><span>Languages:</span> ${Object.values(languages)}</p>`;
        })
        .join('');
    countryInfo.innerHTML = markupInfo;
}


// Nasłuchiwanie wpisywanego kraju - cała magia :)
input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

