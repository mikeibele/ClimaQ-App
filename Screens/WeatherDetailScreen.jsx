import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from "react-native";
import axios from "axios";

const API_KEY = "7b902e22617f60503e63a449259a926d"; // Replace with your OpenWeatherMap API Key

const WeatherDetailScreen = ({ route }) => {
  const { city } = route.params;
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherDetails();
  }, [city]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Weather Details...</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to fetch weather data.</Text>
      </View>
    );
  }

  const { city: cityData, list } = weatherData;
  const todayWeather = list[0];

  const hourlyForecast = list.slice(0, 10); // First 10 entries for hourly forecast
  const dailyForecast = list.filter((_, index) => index % 8 === 0); // Daily forecast (every 8th entry)

  const getWeatherIcon = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <View style={styles.container}>
      <Text style={styles.cityName}>{cityData.name}</Text>
      <Text style={styles.currentTemp}>{Math.round(todayWeather.main.temp)}°F</Text>
      <Text style={styles.weatherDescription}>{todayWeather.weather[0].description}</Text>
      <Text style={styles.highLow}>H: {Math.round(todayWeather.main.temp_max)}° L: {Math.round(todayWeather.main.temp_min)}°</Text>

      {/* Hourly Forecast */}
      <ScrollView horizontal style={styles.hourlyForecastContainer} showsHorizontalScrollIndicator={false}>
        {hourlyForecast.map((item, index) => (
          <View key={index} style={styles.hourlyForecastItem}>
            <Text style={styles.forecastTime}>{new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            <Image source={{ uri: getWeatherIcon(item.weather[0].icon) }} style={styles.weatherIcon} />
            <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°</Text>
            <Text style={styles.forecastDescription}>{item.weather[0].main}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Daily Forecast */}
      <View style={styles.dailyForecastContainer}>
        {dailyForecast.map((item, index) => (
          <View key={index} style={styles.dailyForecastItem}>
            <Text style={styles.dailyForecastDate}>{new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'long' })}</Text>
            <Image source={{ uri: getWeatherIcon(item.weather[0].icon) }} style={styles.weatherIcon} />
            <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°</Text>
            <Text style={styles.forecastDescription}>{item.weather[0].main}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#87CEEB",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6347",
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
  },
  cityName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  currentTemp: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  weatherDescription: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 10,
  },
  highLow: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  hourlyForecastContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  hourlyForecastItem: {
    alignItems: "center",
    marginRight: 15,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
  },
  forecastTime: {
    fontSize: 16,
    color: "#fff",
  },
  forecastTemp: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  forecastDescription: {
    fontSize: 16,
    color: "#fff",
  },
  dailyForecastContainer: {
    marginTop: 10,
  },
  dailyForecastItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    marginBottom: 10,
  },
  dailyForecastDate: {
    fontSize: 16,
    color: "#fff",
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
});

export default WeatherDetailScreen;
