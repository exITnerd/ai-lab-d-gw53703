const apiKey = 'key';

function fetchWeatherData() {
    const cityName = document.getElementById('cityInput').value;
    const currentWeatherContainer = document.getElementById('weatherResult');
    const forecastContainer = document.getElementById('forecastResult');
    
    currentWeatherContainer.innerHTML = "";
    forecastContainer.innerHTML = "";

    if (!cityName) {
        currentWeatherContainer.innerHTML = "Proszę wpisać nazwę miasta.";
        return;
    }

    currentWeatherContainer.style.display = "block";
    forecastContainer.style.display = "block";

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=pl`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric&lang=pl`;

    const weatherRequest = new XMLHttpRequest();
    weatherRequest.open("GET", weatherUrl, true);

    weatherRequest.onload = function() {
        if (weatherRequest.status === 200) {
            const weatherData = JSON.parse(weatherRequest.responseText);
            console.log("Bieżąca pogoda:", weatherData);
            showCurrentWeather(weatherData);
        } else {
            currentWeatherContainer.innerHTML = "Nie udało się znaleźć miasta.";
        }
    };

    weatherRequest.onerror = function() {
        currentWeatherContainer.innerHTML = "Wystąpił błąd połączenia.";
    };

    weatherRequest.send();

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) throw new Error("Nie udało się pobrać prognozy.");
            return response.json();
        })
        .then(forecastData => {
            console.log("Prognoza 5-dniowa:", forecastData);
            showForecast(forecastData);
        })
        .catch(error => {
            forecastContainer.innerHTML = "<p>Nie udało się pobrać prognozy pięciodniowej.</p>";
            console.error("Błąd:", error);
        });
}

function showCurrentWeather(weatherData) {
    const temperature = weatherData.main.temp.toFixed(1);
    const description = weatherData.weather[0].description;
    const weatherIcon = weatherData.weather[0].icon;
    const mainWeatherType = weatherData.weather[0].main.toLowerCase();
    const city = weatherData.name;

    const currentWeatherContainer = document.getElementById('weatherResult');
    currentWeatherContainer.innerHTML = `
        <h2>Bieżąca pogoda w ${city}</h2>
        <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Ikona pogody">
        <p>Temperatura: ${temperature}°C</p>
        <p>Opis: ${description}</p>
    `;

    console.log(`Miasto: ${city}, Temperatura: ${temperature}°C, Opis: ${description}`);

    applyBackgroundEffect(mainWeatherType);
}

function showForecast(forecastData) {
    const forecastContainer = document.getElementById('forecastResult');
    
    const header = document.createElement('h3');
    header.textContent = 'Prognoza 5-dniowa';
    forecastContainer.appendChild(header);

    const innerContainer = document.createElement('div');
    innerContainer.className = 'forecast-container';
    forecastContainer.appendChild(innerContainer);

    forecastData.list.forEach((forecast, index) => {
        if (index % 8 === 0) {
            const date = new Date(forecast.dt * 1000).toLocaleDateString("pl-PL", {
                weekday: "long", day: "numeric", month: "long"
            });
            const temp = forecast.main.temp.toFixed(1);
            const description = forecast.weather[0].description;
            const icon = forecast.weather[0].icon;

            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';

            forecastItem.innerHTML = `
                <h4>${date}</h4>
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Ikona pogody">
                <p>Temperatura: ${temp}°C</p>
                <p>${description}</p>
            `;

            console.log(`Prognoza dla ${date}: ${temp}°C, ${description}`);

            innerContainer.appendChild(forecastItem);
        }
    });
}

function applyBackgroundEffect(weatherType) {
    const videoElement = document.getElementById('backgroundVideo');

    if (weatherType.includes("rain")) {
        videoElement.src = "rain.mp4";
    } else if (weatherType.includes("cloud")) {
        videoElement.src = "clouds.mp4";
    } else if (weatherType.includes("clear")) {
        videoElement.src = "clear.mp4";
    } else if (weatherType.includes("sunny")) {
        videoElement.src = "sun.mp4";
    } else {
        videoElement.src = "";
    }
    
    videoElement.load();
}
