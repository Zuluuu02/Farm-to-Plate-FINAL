import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { db } from '../firebaseConfig';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { AuthContext } from '../providers/AuthProvider'; 

const ShopInformationScreen = ({ route, navigation }) => {

  const { addressData, addressSet } = route.params || {};
  const { shopSetupData, setShopSetupData, userData } = useContext(AuthContext);

  const [shopInfo, setShopInfo] = useState({
    shopName: shopSetupData?.shopName || '',
    pickupAddress: shopSetupData?.pickupAddress || {},
    email: userData?.email || '',
    phone: shopSetupData?.phone || '',
  }); 

  useEffect(() => {
    if (addressData && addressSet) {
      setShopInfo((prevState) => ({
        ...prevState,
        pickupAddress: addressData, // Update pickupAddress with the selected address data
      }));
      console.log('Updated shopInfo:', shopInfo);
    }
  }, [addressData, addressSet]);

  const handleSubmit = async () => {

    if (!shopInfo.shopName || !shopInfo.pickupAddress || !shopInfo.email || !shopInfo.phone) {
      Alert.alert('Error', 'Please fill in all required fields!');
      return;
    }

    const updatedShopSetupData = {
      store_description: shopSetupData.store_description,
      store_photo: shopSetupData.store_photo,
      store_name: shopInfo.shopName,
      default_pickup_address: shopInfo.pickupAddress,
      email: shopInfo.email,
      phone_number: shopInfo.phone,
      approval_status: 'approved',
      farmer_id: userData.uid,
    };

    try {
      const userId = userData?.uid;
      
      if (!userId) {
        Alert.alert('Error', 'User not found.');
        return;
      }

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: 'farmer' });
      
      const userAddressRef = collection(db, 'users', userId, 'addresses');
      const newDocRef = await addDoc(userAddressRef, shopInfo.pickupAddress);

      const updatedPickupAddress = {
        ...shopInfo.pickupAddress,
        id: newDocRef.id,  // Add the document ID as 'id' in pickupAddress.
      };

      updatedShopSetupData.default_pickup_address = updatedPickupAddress;

      const farmerDetailsRef = collection(db, 'users', userId, 'farmer_details');
      await addDoc(farmerDetailsRef, updatedShopSetupData); 

      setShopSetupData({ 
        ...shopSetupData, 
        updatedShopSetupData
      });

      navigation.navigate('RegistrationSuccess');

    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formWrapper}>
        <Text style={styles.header}>Shop Information</Text>

        {/* Shop Name */}
        <Text style={styles.label}>Shop Name *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter shop name"
            onChangeText={(text) => setShopInfo({ ...shopInfo, shopName: text })}
            value={shopInfo.shopName}
            maxLength={30}
          />
          <Text style={styles.charCount}>{shopInfo.shopName.length}/30</Text>
        </View>

        {/* Pickup Address */}
        <Text style={styles.label}>Address *</Text>
        <TouchableOpacity 
          style={styles.inputButton}
          onPress={() =>
            navigation.navigate('AddressForm', { allowedType: 'pickup', settingUpShopInfo: true })
          }
        >
          <Text style={styles.inputButtonText}>
            {shopInfo.pickupAddress ? 'Change' : 'Set'}
          </Text>
        </TouchableOpacity>

        {/* Email */}
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.emailInput}
          placeholder="Enter email"
          value={shopInfo.email}
          editable={false}
        />

        {/* Phone Number */}
        <Text style={styles.label}>Phone *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          onChangeText={(text) => setShopInfo({ ...shopInfo, phone: text })}
          value={shopInfo.phone}
          keyboardType="phone-pad"
        />

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: '5%',
    paddingVertical: '10%',
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    alignSelf: 'flex-start',
    width: '100%',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    height: 45,
    marginBottom: 5,
    backgroundColor: '#fff',
    fontSize: 14,
    width: '100%',
  },
  inputButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    height: 45,
    marginBottom: 5,
    backgroundColor: '#f0f0f0', // Light grey background for disabled input
    fontSize: 14,
    width: '100%',
    color: '#666', // Dark grey text to indicate it's disabled
  },
  charCount: {
    fontSize: 12,
    color: '#555',
    textAlign: 'right',
    marginTop: 5,  // Adjust the space between input and character count
  },
  nextButton: {
    backgroundColor: '#09320a',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShopInformationScreen;
