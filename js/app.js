(() => {
    document.getElementById('submit-btn').addEventListener('click', (e) => {
        // prevent form submission
        e.preventDefault();
        const locationName = document.getElementById('locationName').value;

        // Fetch Places from google Places API
        getPlacesData(locationName);
    });
})();

function getPlacesData(locationName) {
    var request = {
        query: locationName,
        fields: ['name', 'geometry'],
    };

    var service = new google.maps.places.PlacesService(document.createElement('div'));

    service.findPlaceFromQuery(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                // console.log(results[i]);

                // Get Weather from weather API
                getWeatherData(results[i].geometry.location.lat(), results[i].geometry.location.lng());

            }
        }
    });
}

function getWeatherData(lat, lng) {
    //  APIXU weather API key
    const key = "43ab36619f55413f97692741190206";

    // xhr request
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `https://api.apixu.com/v1/current.json?q=${lat},${lng}&key=${key}`);

    xhr.onload = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {

            const data = JSON.parse(xhr.responseText);
            console.log(data);
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

function renderWeatherData(data) {
    let content = `
    <div id="result-content">
        <div>
            <p>${data.name}, ${data.region}, ${data.country}</p>
            <img id="condition-icon" src="${data.icon}">
        </div>
        <h3>${data.condition}</h3>
        <h1>${data.temp_c} &deg;C</h1>
        <p>Feelslike: ${data.feelslike_c}</p>
        <div class="d-flex justify-content-between">
            <p>Wind Speed: ${data.windSpeed}</p>
            <p>Humidity: ${data.humidity}</p>
        </div>
    </div>`;

    document.getElementById('weather-data').innerHTML = content;

}