import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import fetchWeather from "../utils/fetchWeather";
import CityWeatherCard from "../component/CityWeatherCard";

const HomeScreen = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [search, setSearch] = useState("");

  const cities = ["Cupertino", "San Francisco", "Seattle", "Miami", "London", "Los Angeles"];

  useEffect(() => {
    const loadWeatherData = async () => {
      const data = await fetchWeather(cities);
      setWeatherData(data);
    };
    loadWeatherData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ClimaQ</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a city or airport"
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />
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
  searchInput: {
    backgroundColor: "#333",
    borderRadius: 10,
    color: "#fff",
    padding: 10,
    margin: 20,
    fontSize: 16,
  },
});

export default HomeScreen;
