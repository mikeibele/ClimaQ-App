import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CityWeatherCard = ({ city }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cityName}>{city.name}</Text>
      <Text style={styles.temp}>{city.temp}°</Text>
      <Text style={styles.weather}>{city.weather}</Text>
      <View style={styles.tempRange}>
        <Text style={styles.rangeText}>H: {city.high}°</Text>
        <Text style={styles.rangeText}>L: {city.low}°</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#333",
    borderRadius: 10,
    margin: 10,
    padding: 15,
  },
  cityName: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  temp: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  weather: { fontSize: 16, color: "#aaa" },
  tempRange: { flexDirection: "row", justifyContent: "space-between" },
  rangeText: { color: "#aaa" },
});

export default CityWeatherCard;
