import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
  Animated,
  Easing,
  Image,
  Alert,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../providers/AuthProvider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {

  const { userData, setUserData } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));

  const handleSignup = async () => {
    try { 

      //Sign up the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //Create the corresponding user document in the Firestore database
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        role: 'buyer',
        subscription: {
          expiry_date: null,
          plan_id: 'Free',
        },
        created_at: new Date(),
        uid: user.uid
      });

      console.log('User signed up:', user.uid);

      //Store userData in context to be able acccess globally
      setUserData({ email: user.email, role: user.role, uid: user.uid }); 
      
      setModalVisible(true);
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      setEmail('');
      setPassword('');
      
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      console.log('User data updated:', userData); // Log after the state change
    }
  }, [userData]);

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 400,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleContinue = () => {
    closeModal();
  };

  const animatedModalStyle = {
    transform: [
      {
        scale: modalAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 1],
        }),
      },
    ],
    opacity: modalAnimation,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
          <Text style={styles.title}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ddd"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ddd"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <LinearGradient
              colors={['#7A9F59', '#4C7D2D']}
              style={styles.buttonGradient}
            >
              <Text style={styles.signupButtonText}>SIGN UP</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login here</Text>
            </TouchableOpacity>
          </View>

          {/* Modal for signup success */}
          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <Animated.View style={[styles.modalView, animatedModalStyle]}>
                <Pressable style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>✖</Text>
                </Pressable>
                <LinearGradient colors={['#7A9F59', '#4C7D2D']} style={styles.modalHeader}>
                  <Icon name="check-circle" size={40} color="#fff" />
                  <Text style={styles.successText}>SUCCESS</Text>
                </LinearGradient>
                <View style={styles.centeredTextContainer}>
                  <Text style={styles.modalMessage}>Your account has been created!</Text>
                  <Text style={styles.modalTips}>You can now log in and start using the app.</Text>
                </View>
                <Pressable style={styles.modalButton} onPress={handleContinue}>
                  <Text style={styles.modalButtonText}>Continue</Text>
                </Pressable>
              </Animated.View>
            </View>
          </Modal>
        </View>
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
  signupButton: {
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
  signupButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  loginText: {
    color: '#ddd',
    fontSize: 16,
  },
  loginLink: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#3D6F3D',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 15,
    width: '100%',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  centeredTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 18,
    color: '#3D6F3D',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTips: {
    fontSize: 14,
    color: '#3D6F3D',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#3D6F3D',
    padding: 12,
    borderRadius: 5,
    width: '60%',
    alignItems: 'center',
    elevation: 2,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
