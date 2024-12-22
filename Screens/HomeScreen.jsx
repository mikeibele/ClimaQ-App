import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from "react-native";
import fetchWeather from "../utils/fetchWeather";
import CityWeatherCard from "../component/CityWeatherCard";

const HomeScreen = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [search, setSearch] = useState("");

  const cities = ["Cupertino", "San Francisco", "Seattle", "Miami", "London", "Los Angeles"];

  // Fetch initial weather data for default cities
  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        const data = await fetchWeather(cities);
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching initial weather data:", error);
      }
    };
    loadWeatherData();
  }, []);

  // Handle search request
  const handleSearch = async () => {
    if (!search.trim()) {
      Alert.alert("Input Error", "Please enter a city name.");
      return;
    }
    try {
      const data = await fetchWeather([search.trim()]);
      if (data.length > 0) {
        setWeatherData((prevData) => [data[0], ...prevData]); // Add the searched city to the top
        setSearch(""); // Clear the search input
      } else {
        Alert.alert("City Not Found", "No weather data found for this city.");
      }
    } catch (error) {
      console.error("Error fetching weather for searched city:", error);
      Alert.alert("Error", "Could not fetch weather data. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ClimaQ</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a city or airport"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
        <Button title="Search" onPress={handleSearch} color="#1e90ff" />
      </View>
      <ScrollView>
        {weatherData.map((city, index) => (
          <CityWeatherCard key={index} city={city} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 50,
  },
  header: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 10,
    color: "#fff",
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
});

export default HomeScreen;
