import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ImageBackground,
  Button,
} from "react-native";
import axios from "axios";

const API_KEY = "7b902e22617f60503e63a449259a926d";

// Corrected image paths - use exact path to your image
const BACKGROUND_IMAGE = require("../asset/image/clearsky.jpg");

const fetchWeather = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    return {
      name: city,
      temp: Math.round(response.data.main.temp),
      weather: response.data.weather[0].main,
      high: Math.round(response.data.main.temp_max),
      low: Math.round(response.data.main.temp_min),
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

const fetchLocation = async () => {
  try {
    const response = await axios.get("https://ipapi.co/json/");
    return response.data.city;
  } catch (error) {
    console.error("Error fetching user location:", error);
    return null;
  }
};

const HomeScreen = ({ navigation }) => {
  const initialCities = ["Cupertino", "New York", "London", "Tokyo"];
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [myLocationWeather, setMyLocationWeather] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);

      const data = await Promise.all(initialCities.map(fetchWeather));
      const filteredData = data.filter((item) => item !== null);

      const userCity = await fetchLocation();
      if (userCity) {
        const userWeather = await fetchWeather(userCity);
        if (userWeather) setMyLocationWeather(userWeather);
      }

      setWeatherData(filteredData);
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearchLoading(true);
    const data = await fetchWeather(search.trim());
    if (data) {
      setWeatherData((prevData) => [data, ...prevData]);
    }
    setSearch("");
    setSearchLoading(false);
  };

  if (loading) {
    return (
      <ImageBackground
        source={BACKGROUND_IMAGE}
        style={styles.loadingContainer}
        resizeMode="cover"
      >
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Weather Data...</Text>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>Weather</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a city"
          placeholderTextColor="#ccc"
          value={search}
          onChangeText={setSearch}
        />
        <Button title="Search" onPress={handleSearch} color="#007AFF" />
      </View>
      {searchLoading && (
        <ActivityIndicator
          size="small"
          color="#007AFF"
          style={styles.searchLoading}
        />
      )}

      {myLocationWeather && (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("WeatherDetail", { city: myLocationWeather.name })
          }
        >
          <View style={styles.cardContent}>
            <Text style={styles.cityName}>My Location</Text>
            <Text style={styles.temperature}>{myLocationWeather.temp}°C</Text>
            <Text style={styles.weatherDescription}>
              {myLocationWeather.weather}
            </Text>
            <Text style={styles.highLow}>
              H:{myLocationWeather.high}°C L:{myLocationWeather.low}°C
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <FlatList
        data={weatherData}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("WeatherDetail", { city: item.name })
            }
          >
            <View style={styles.cardContent}>
              <Text style={styles.cityName}>{item.name}</Text>
              <Text style={styles.temperature}>{item.temp}°C</Text>
              <Text style={styles.weatherDescription}>{item.weather}</Text>
              <Text style={styles.highLow}>
                H:{item.high}°C L:{item.low}°C
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  searchLoading: {
    marginVertical: 10,
    alignSelf: "center",
  },
  card: {
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
  },
  cardContent: {
    padding: 15,
  },
  cityName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  temperature: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 5,
  },
  weatherDescription: {
    fontSize: 16,
    color: "#fff",
  },
  highLow: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});

export default HomeScreen;