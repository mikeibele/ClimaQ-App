import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import MapView, { UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function RadarMapScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [radarTime, setRadarTime] = useState(null);
  const [layer, setLayer] = useState("rain"); // default layer
  const [loading, setLoading] = useState(true);

  // ✅ Get user's location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        setRegion({
          latitude: 6.5244, // fallback: Lagos
          longitude: 3.3792,
          latitudeDelta: 10,
          longitudeDelta: 10,
        });
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 5,
        longitudeDelta: 5,
      });
    })();
  }, []);

  // ✅ Fetch latest radar timestamp from RainViewer API
  useEffect(() => {
    const fetchRadarTimestamps = async () => {
      try {
        const res = await fetch("https://tilecache.rainviewer.com/api/maps.json");
        const timestamps = await res.json();
        const latest = timestamps[timestamps.length - 1]; // latest timestamp
        setRadarTime(latest);
      } catch (error) {
        console.error("Error fetching radar timestamps:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRadarTimestamps();
  }, []);

  // ✅ Generate tile URL based on selected layer
  const getTileUrl = () => {
    switch (layer) {
      case "temp":
        return `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=7b902e22617f60503e63a449259a926d`;
      case "wind":
        return `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=7b902e22617f60503e63a449259a926d`;
      default:
        return `https://tilecache.rainviewer.com/v2/radar/${radarTime}/256/{z}/{x}/{y}/2/1_1.png`;
    }
  };

  // ✅ Loading Screen
  if (!region || loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00aaff" />
        <Text style={{ color: "#555", marginTop: 10 }}>Loading Radar Map...</Text>
      </View>
    );
  }

  // ✅ Main UI
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(r) => setRegion(r)}
        showsUserLocation={true}
        showsCompass={true}
        showsScale={true}
      >
        {/* Live Weather Layer */}
        <UrlTile
          urlTemplate={getTileUrl()}
          maximumZ={12}
          zIndex={1}
          tileSize={256}
        />
      </MapView>

      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* 🌦️ Map Layer Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, layer === "rain" && styles.activeButton]}
          onPress={() => setLayer("rain")}
        >
          <Text style={styles.buttonText}>Rain</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, layer === "temp" && styles.activeButton]}
          onPress={() => setLayer("temp")}
        >
          <Text style={styles.buttonText}>Temp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, layer === "wind" && styles.activeButton]}
          onPress={() => setLayer("wind")}
        >
          <Text style={styles.buttonText}>Wind</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 25,
    zIndex: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#00aaff",
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
