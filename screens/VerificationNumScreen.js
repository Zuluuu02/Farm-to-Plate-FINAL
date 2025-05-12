import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const VerificationNumScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(12);

  // Countdown timer logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    setTimer(12); // Reset the timer
    console.log('Verification code resent!');
    // Add actual resend logic here
  };

  const handleSubmit = () => {
    console.log('OTP entered:', otp);
    if (otp === '123456') { // Replace with actual validation logic
      navigation.navigate('BusinessInfo'); // Navigate to Home screen
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        Your Verification code is sent by SMS to (+63) 915 231 5869
      </Text>
      <TextInput
        style={styles.otpInput}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Next</Text>
      </TouchableOpacity>
      {timer > 0 ? (
        <Text style={styles.timer}>Please wait {timer} seconds to resend</Text>
      ) : (
        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    width: '80%',
    height: 50,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#2E4C2D',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
  },
  timer: {
    fontSize: 14,
    color: 'gray',
  },
  resendText: {
    fontSize: 14,
    color: '#2E4C2D',
    marginTop: 10,
    textDecorationLine: 'underline',
    width: '80%',
  },
});

export default VerificationNumScreen;
