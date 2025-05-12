import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import CheckBox from 'react-native-check-box';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      
      if (!email && !password) {
        Alert.alert('Invalid Input', 'Please enter your email and password.');
        return;
      }

      if (!email) {
        Alert.alert('Invalid Input', 'Please enter your email.');
        return;
      }

      if (!password) {
        Alert.alert('Invalid Input', 'Please enter your password.');
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user.email);

  } catch (error) {
    Alert.alert('Login Error', error.message);
    // setEmail("");
    // setPassword("");
  }
  };

  return (
    <ImageBackground
      source={require('../images/plate.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Image
          source={require('../images/Farm to Plate.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ddd"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ddd"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.passwordContainer}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              style={styles.checkbox}
              onClick={() => setShowPassword(!showPassword)}
              isChecked={showPassword}
              checkBoxColor="#fff"
            />
            <Text style={styles.checkboxText}>Show Password</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Recovery')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <LinearGradient
            colors={['#7A9F59', '#4C7D2D']}
            style={styles.buttonGradient}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign up here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    color: '#fff',
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    color: '#ddd',
    fontSize: 12,
    marginLeft: 5,
  },
  forgotPassword: {
    color: '#ddd',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  loginButton: {
    width: '100%',
    height: 50,
    marginBottom: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signupText: {
    color: '#ddd',
    fontSize: 16,
  },
  signupLink: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
