import axios from "axios";

const API_KEY = "7b902e22617f60503e63a449259a926d"; // Replace with your OpenWeatherMap API Key

const fetchWeather = async (cities) => {
  try {
    const data = await Promise.all(
      cities.map(async (city) => {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
        );
        return {
          name: city,
          temp: Math.round(response.data.main.temp),
          weather: response.data.weather[0].main,
          high: Math.round(response.data.main.temp_max),
          low: Math.round(response.data.main.temp_min),
        };
      })
    );
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return [];
  }
};

export default fetchWeather;
