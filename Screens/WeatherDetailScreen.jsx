import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";

const API_KEY = "7b902e22617f60503e63a449259a926d";

const WeatherDetailScreen = ({ route }) => {
  const { city } = route.params;
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
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

  const getWeatherIcon = (icon) =>
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  if (loading) {
    return (
      <ImageBackground
        source={require("../asset/image/clearsky.jpg")}
        style={styles.background}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading Weather Details...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (!weatherData) {
    return (
      <ImageBackground
        source={require("../asset/image/clearsky.jpg")}
        style={styles.background}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to fetch weather data.</Text>
        </View>
      </ImageBackground>
    );
  }

  const { city: cityData, list } = weatherData;
  const todayWeather = list[0];
  const hourlyForecast = list.slice(0, 10);
  const dailyForecast = list.filter((_, index) => index % 8 === 0);
  const feelsLike = Math.round(todayWeather.main.feels_like);
  const windSpeed = todayWeather.wind.speed;
  const windDeg = todayWeather.wind.deg;
  const precipitation = todayWeather.pop
    ? Math.round(todayWeather.pop * 100)
    : 0;
  const { lat, lon } = cityData.coord;

  return (
    <ImageBackground
      source={require("../asset/image/clearsky.jpg")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.cityName}>{cityData.name}</Text>
        <Text style={styles.currentTemp}>
          {Math.round(todayWeather.main.temp)}°C
        </Text>
        <Text style={styles.weatherDescription}>
          {todayWeather.weather[0].description}
        </Text>
        <Text style={styles.highLow}>
          H: {Math.round(todayWeather.main.temp_max)}°C | L: {" "}
          {Math.round(todayWeather.main.temp_min)}°C
        </Text>

        {/* Extra Info as Separate Cards */}
        <View style={styles.extraDetailsContainer}>
          <View style={styles.detailCard}>
            <Text style={styles.cardTitle}>Feels Like</Text>
            <Text style={styles.cardValue}>{feelsLike}°C</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.cardTitle}>Wind</Text>
            <Text style={styles.cardValue}>{windSpeed} m/s</Text>
            <Text style={styles.cardSubValue}>{windDeg}°</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.cardTitle}>Precipitation</Text>
            <Text style={styles.cardValue}>{precipitation}%</Text>
          </View>
        </View>

        {/* Map Integration */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: lat,
              longitude: lon,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            <Marker coordinate={{ latitude: lat, longitude: lon }} />
          </MapView>
        </View>

        {/* Hourly Forecast */}
        <Text style={styles.sectionTitle}>Hourly Forecast</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hourlyForecastContainer}
        >
          {hourlyForecast.map((item, index) => (
            <View key={index} style={styles.hourlyForecastItem}>
              <Text style={styles.forecastTime}>
                {new Date(item.dt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Image
                source={{ uri: getWeatherIcon(item.weather[0].icon) }}
                style={styles.weatherIcon}
              />
              <Text style={styles.forecastTemp}>
                {Math.round(item.main.temp)}°C
              </Text>
              <Text style={styles.forecastDescription}>
                {item.weather[0].main}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Daily Forecast */}
        <Text style={styles.sectionTitle}>Daily Forecast</Text>
        <View style={styles.dailyForecastContainer}>
          {dailyForecast.map((item, index) => (
            <View key={index} style={styles.dailyForecastItem}>
              <Text style={styles.dailyForecastDate}>
                {new Date(item.dt * 1000).toLocaleDateString([], {
                  weekday: "long",
                })}
              </Text>
              <Image
                source={{ uri: getWeatherIcon(item.weather[0].icon) }}
                style={styles.weatherIcon}
              />
              <Text style={styles.forecastTemp}>
                {Math.round(item.main.temp)}°C
              </Text>
              <Text style={styles.forecastDescription}>
                {item.weather[0].main}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  currentTemp: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  weatherDescription: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    textTransform: "capitalize",
  },
  highLow: {
    fontSize: 16,
    color: "#eee",
    textAlign: "center",
    marginBottom: 20,
  },
  extraDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  cardValue: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  cardSubValue: {
    fontSize: 14,
    color: "#fff",
    marginTop: 2,
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
    marginTop: 20,
  },
  hourlyForecastContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  hourlyForecastItem: {
    width: 100,
    alignItems: "center",
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  forecastTime: {
    fontSize: 14,
    color: "#fff",
  },
  forecastTemp: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  forecastDescription: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  dailyForecastContainer: {
    marginTop: 10,
  },
  dailyForecastItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  dailyForecastDate: {
    fontSize: 16,
    color: "#fff",
    width: 100,
  },
});

export default WeatherDetailScreen;
