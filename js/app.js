(() => {
    document.getElementById('form').addEventListener('submit', (e) => {
        // prevent form submission
        e.preventDefault();
    });
})();

// Adds a DOM event listener to the window object, for the 'load' event, to run initAutocomplete function
google.maps.event.addDomListener(window, 'load', initAutocomplete);

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete((document.getElementById('locationName')), {
        types: ['geocode']
    });
    // fields in the form.
    autocomplete.addListener('place_changed', getPlaceDetails);
}

// Fetch Places from google Places API
function getPlaceDetails() {
    // Get the place details from the autocomplete object.
    const place = autocomplete.getPlace();
    console.log(place);
    // get weather from APIXU API
    getWeather(place.geometry.location.lat(), place.geometry.location.lng());

}

// Get Weather from weather API
function getWeather(lat, lng) {

    // show loading gif
    document.getElementById('weather-data').innerHTML = `<div class="text-center"><img src="img/loading.gif"></div>`;

    //  APIXU weather API key
    const key = "43ab36619f55413f97692741190206";

    // xhr request
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `https://api.apixu.com/v1/current.json?q=${lat},${lng}&key=${key}`);

    xhr.onload = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {

            const data = JSON.parse(xhr.responseText);
            // console.log(data);
            const weatherData = {
                name: data.location.name,
                region: data.location.region,
                country: data.location.country,
                temp_c: data.current.temp_c,
                temp_f: data.current.temp_f,
                condition: data.current.condition.text,
                icon: data.current.condition.icon,
                windSpeed: data.current.wind_kph,
                humidity: data.current.humidity,
                feelslike_c: data.current.feelslike_c,
                feelslike_f: data.current.feelslike_f,
            }
            // Render weather data
            renderWeatherData(weatherData);
        }
    }
    xhr.send();
}

// Render weather data
function renderWeatherData(data) {
    let content = `
    <div id="result-content">
        <div>
            <p>${data.name}, ${data.region}, ${data.country}</p>
            <img id="condition-icon" src="${data.icon}">
        </div>
        <h3>${data.condition}</h3>
        <h1>${data.temp_c} &deg;C</h1>
        <p>Feelslike: ${data.feelslike_c} &deg;C</p>
        <div class="d-flex justify-content-between">
            <p>Wind Speed: ${data.windSpeed}Km/h</p>
            <p>Humidity: ${data.humidity}%</p>
        </div>
    </div>`;

    document.getElementById('weather-data').innerHTML = content;
}