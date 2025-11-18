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
  SafeAreaView,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

const API_KEY = "7b902e22617f60503e63a449259a926d";
const BACKGROUND_IMAGE = require("../asset/image/clearsky.jpg");

// Fetch weather by city name
const fetchWeather = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    return {
      name: response.data.name,
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

// Fetch weather using coordinates
const fetchWeatherByCoords = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission to access location was denied");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );

    const data = response.data;

    return {
      name: data.name,
      temp: Math.round(data.main.temp),
      weather: data.weather[0].main,
      high: Math.round(data.main.temp_max),
      low: Math.round(data.main.temp_min),
    };
  } catch (error) {
    console.error("Error fetching weather by coordinates:", error);
    return null;
  }
};

const HomeScreen = () => {
  const initialCities = ["Cupertino", "New York", "London", "Tokyo"];
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [myLocationWeather, setMyLocationWeather] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);

      const cityWeather = await Promise.all(initialCities.map(fetchWeather));
      setWeatherData(cityWeather.filter((item) => item !== null));

      const locationWeather = await fetchWeatherByCoords();
      if (locationWeather) setMyLocationWeather(locationWeather);

      setLoading(false);
    };

    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;

    setSearchLoading(true);
    const data = await fetchWeather(search.trim());

    if (data) {
      setWeatherData((prev) => [data, ...prev]);
    }

    setSearch("");
    setSearchLoading(false);
  };

  if (loading) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Weather Data...</Text>
      </ImageBackground>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.container}>
        <Text style={styles.title}>Weather</Text>

        {/* Search Bar */}
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

        {/* My Location */}
        {myLocationWeather?.name && (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("WeatherDetailScreen", {
                city: myLocationWeather.name,
              })
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

        {/* FlatList + Footer Radar Button */}
        <FlatList
          data={weatherData}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("WeatherDetailScreen", { city: item.name })
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
          ListFooterComponent={
            <View style={styles.footerSpacing}>
              <TouchableOpacity
                style={styles.radarButton}
                onPress={() => navigation.navigate("RadarMapScreen")}
              >
                <Text style={styles.radarButtonText}>🛰️ Live Radar Map</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
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
  },
  footerSpacing: {
    marginTop: 20,
    paddingBottom: 40, // KEYS: prevents overlap with bottom gesture bar
    alignItems: "center",
  },
  radarButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  radarButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
