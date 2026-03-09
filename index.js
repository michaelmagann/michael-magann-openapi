const locations = [
    { name: "Worcester, MA", lat: 42.2626, lon: -71.8023 },
    { name: "San Diego, CA", lat: 32.7157, lon: -117.1611 },
    { name: "Canary Islands (Las Palmas)", lat: 28.1235, lon: -15.4363 },
    { name: "Medellín, Colombia", lat: 6.2442, lon: -75.5812 }
];

function getWeatherDescription(code) {
    const descriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    };
    return descriptions[code] || "Unknown";
}

async function fetchWeather(location) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true&temperature_unit=fahrenheit`;
    const response = await fetch(url);
    const data = await response.json();
    const current = data.current_weather;

    return {
        name: location.name,
        temperature: current.temperature,
        weather: getWeatherDescription(current.weathercode)
    };
}

async function displayWeather() {
    const container = document.getElementById("weatherContainer");
    container.innerHTML = "";

    try {
        const weatherData = await Promise.all(locations.map(fetchWeather));
        const worcesterTemp = weatherData[0].temperature;

        weatherData.forEach((weather, index) => {
            const card = document.createElement("div");
            card.className = "weather-card";

            let differenceHTML = "";
            if (index !== 0) {
                const diff = weather.temperature - worcesterTemp;
                const absDiff = Math.abs(diff).toFixed(1);

                differenceHTML = diff > 0
                    ? `<p class="warm">+${absDiff}°F warmer than Worcester</p>`
                    :diff < 0
                    ? `<p class="cold">${absDiff}°F colder than Worcester</p>`
                    : `<p class="same">Same temperature as Worcester</p>`;
            }

            card.innerHTML = `
                <h2>${weather.name}</h2>
                <div class="temp">${weather.temperature}°F</div>
                <p>${weather.weather}</p>
                ${differenceHTML}
            `;

            if (index === 0) card.classList.add("home-city");
            container.appendChild(card);
        });


        
        const timestamp = document.getElementById("lastUpdated");
        timestamp.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;

    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}


displayWeather();
setInterval(displayWeather, 600000);
