import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

export default function LocationScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Animated text fade-in and fade-out loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  useEffect(() => {
    const requestLocationAccess = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to use this feature. Please enable it in your device settings.',
            [{ text: 'OK', onPress: () => navigation.replace('Banner') }]
          );
          setIsLoading(false);
          return;
        }

        // Fetch location
        const location = await Location.getCurrentPositionAsync({});
        console.log('User location:', location);

        // Navigate to the next screen
        navigation.replace('Banner');
        
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch location. Please try again later.');
        console.error('Error fetching location:', error);
      } finally {
        setIsLoading(false);
      }
    };

    requestLocationAccess();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../images/plate.jpg')} // Ensure the file path is correct
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(158, 195, 135, 0.8)', 'rgba(158, 195, 135, 0.6)', 'transparent']}
          style={styles.overlay}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../images/Farm to Plate.png')} // Ensure the file path is correct
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.loaderContainer}>
            {isLoading ? (
              <>
                <ActivityIndicator size="large" color="#fff" style={styles.loader} />
                <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
                  Granting Location Access...
                </Animated.Text>
              </>
            ) : (
              <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
                Waiting for User Action...
              </Animated.Text>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#7A9F59',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 50,
  },
  logo: {
    width: 300,
    height: 400,
  },
  loaderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loader: {
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});
