import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";

const API_KEY = "7b902e22617f60503e63a449259a926d"; // Replace with your OpenWeatherMap API Key

const WeatherDetailScreen = ({ route }) => {
  const { city } = route.params;
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`
        );
        setHourlyData(response.data.list.slice(0, 8)); // Next 8 hours
        setDailyData(response.data.list.filter((_, index) => index % 8 === 0)); // Simulated daily data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather details:", error);
      }
    };

    fetchDetails();
  }, [city]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Weather Details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{city}</Text>
      <Text style={styles.subHeader}>Hourly Forecast</Text>
      <FlatList
        horizontal
        data={hourlyData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.hourlyItem}>
            <Text>{new Date(item.dt * 1000).getHours()}:00</Text>
            <Text>{Math.round(item.main.temp)}°F</Text>
            <Text>{item.weather[0].main}</Text>
          </View>
        )}
      />
      <Text style={styles.subHeader}>Daily Forecast</Text>
      <FlatList
        data={dailyData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.dailyItem}>
            <Text>{new Date(item.dt * 1000).toLocaleDateString()}</Text>
            <Text>High: {Math.round(item.main.temp_max)}°F</Text>
            <Text>Low: {Math.round(item.main.temp_min)}°F</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f8ff",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
  },
  hourlyItem: {
    marginHorizontal: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e0ffff",
    borderRadius: 10,
  },
  dailyItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#e0f7fa",
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
});

export default WeatherDetailScreen;
