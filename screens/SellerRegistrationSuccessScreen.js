import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SellerRegistrationSuccessScreen = ({ navigation }) => {
  const handleGoToAddProduct = () => {
    navigation.navigate('AddProduct'); // Replace with the correct target screen name
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seller Registration</Text>
      </View>

      {/* Success Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.successMessage}>Submitted Successfully!</Text>
        <Text style={styles.subMessage}>
          Now you can proceed to add your first product
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.push('ShopDashboard')}>
        <Text style={styles.buttonText}>Go to Shop Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // Add horizontal padding for responsiveness
  },
  header: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10, // Adds top and bottom spacing
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40, // Adjust bottom margin for spacing
    paddingHorizontal: 10, // Add padding to prevent text overflow
  },
  successMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E4C2D',
    marginBottom: 10, // Space between title and subtitle
  },
  subMessage: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    lineHeight: 22, // Improve readability with consistent line spacing
    marginHorizontal: 10, // Space between the text and screen edges
  },
  button: {
    backgroundColor: '#2E4C2D',
    paddingVertical: 12,
    paddingHorizontal: 50, // Adjust button size for consistency
    borderRadius: 8, // Slightly rounded corners for aesthetics
    marginTop: 20, // Space between button and content
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default SellerRegistrationSuccessScreen;
