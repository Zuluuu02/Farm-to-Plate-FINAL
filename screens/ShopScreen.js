import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ShopScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Welcome to Farm to Plate!</Text>

      {/* Description */}
      <Text style={styles.description}>
        To get started, register as a seller by providing the necessary information.
      </Text>

      {/* Start Registration Button */}
      <TouchableOpacity
        style={styles.startRegistrationButton}
        onPress={() => navigation.navigate('SetUpShop')} // Navigate to registration screen
      >
        <Text style={styles.startRegistrationText}>Start Registration</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  startRegistrationButton: {
    backgroundColor: '#09320a',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  startRegistrationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShopScreen;
