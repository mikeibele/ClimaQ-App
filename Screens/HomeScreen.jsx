import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
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

const HomeScreen = ({ navigation }) => {
  const cities = ["Cupertino", "New York", "London", "Tokyo"];
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather(cities).then((data) => {
      setWeatherData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Weather Data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <FlatList
        data={weatherData}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cityButton}
            onPress={() => navigation.navigate("WeatherDetail", { city: item.name })}
          >
            <Text style={styles.cityText}>
              {item.name}: {item.temp}°F, {item.weather}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  cityButton: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#e0f7fa",
    borderRadius: 10,
  },
  cityText: {
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
});

export default HomeScreen;
