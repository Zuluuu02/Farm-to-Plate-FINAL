// MapScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = ({ route, navigation }) => {
  const { initialRegion, allowedType, settingUpShopInfo } = route.params || {
    latitude: 8.484722, 
    longitude: 124.656278,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005
  };

  const [region, setRegion] = useState(initialRegion);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [barangay, setBarangay] = useState('');
  const [city, setCity] = useState('');

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = response[0]; // Get the first result
      const barangay = address.barangay || ''; 
      const city = address.city || 'Cagayan de Oro';

      console.log (barangay + city);

      setBarangay(barangay); 
      setCity(city);  

    } catch (error) {
      Alert.alert('Error', 'Unable to retrieve address from selected location.');
    }
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoordinate({ latitude, longitude });
    // Perform reverse geocoding with selected location
    await getAddressFromCoordinates(latitude, longitude);
  };

  const handleSaveLocation = () => {
    if (selectedCoordinate) {
      navigation.navigate('AddressForm', { 
        selectedCoordinate,
        barangay,
        city,
        allowedType,
        settingUpShopInfo
      });

    } else {
      Alert.alert('Error', 'Please select a location on the map first.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        onPress={handleMapPress}
      >
        {selectedCoordinate && (
          <Marker coordinate={selectedCoordinate} />
        )}
      </MapView>
      <Button title="Save Location" onPress={handleSaveLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
