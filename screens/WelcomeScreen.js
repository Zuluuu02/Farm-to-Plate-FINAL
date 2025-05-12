import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen({ navigation }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Location');
    }, 2000);

    return () => clearTimeout(timer); // Clear timeout on unmount
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
  },
});
