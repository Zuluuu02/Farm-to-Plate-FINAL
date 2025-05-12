// RecoveryScreen.js
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function RecoveryScreen() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleRecovery = () => {
    // Add your recovery logic here (e.g., API call)
    // For demonstration, we'll just navigate back to Login
    console.log(`Recovery email sent to: ${email}`);
    navigation.navigate('Login'); // Navigate back to LoginScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recover Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.recoveryButton} onPress={handleRecovery}>
        <Text style={styles.recoveryButtonText}>SEND RECOVERY EMAIL</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLogin}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7A9F59',
  },
  title: {
    fontSize: 40,
    color: '#fff',
    marginBottom: 50,
  },
  input: {
    width: width * 0.8,
    height: 50,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    color: '#fff',
    marginBottom: 30,
    fontSize: 18,
  },
  recoveryButton: {
    width: width * 0.8,
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 30,
  },
  recoveryButtonText: {
    fontSize: 18,
    color: '#7A9F59',
    fontWeight: 'bold',
  },
  backToLogin: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
