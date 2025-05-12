import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Switch,
  Modal,
} from 'react-native'; 
import { Picker } from '@react-native-picker/picker'; 
import { doc, collection, addDoc, updateDoc, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db, } from '../firebaseConfig'; 
import { AuthContext } from '../providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const AddressForm = ({ navigation, route }) => {

  const { userData } = useContext(AuthContext);
  const { 
    isEdit = false, 
    addressData = null, 
    allowedType = null, 
    settingUpShopInfo = false, 
  } = route.params || {}; 

  const [name, setName] = useState(addressData?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(addressData?.phone_number || '');
  const [addressLine1, setAddressLine1] = useState(addressData?.address_line_1 || '');
  const [barangay, setBarangay] = useState(addressData?.barangay || '');
  const [city, setCity] = useState(addressData?.city || '');
  const [zipCode, setZipCode] = useState(addressData?.zip_code || '');
  const [isDefault, setIsDefault] = useState(addressData?.isdefault || false);
  const [region, setRegion] = useState(
    addressData?.region || {
      latitude: 8.484722, 
      longitude: 124.656278, 
      latitudeDelta: 0.005,
      longitudeDelta: 0.005, 
    }
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const barangays = [
    "Agusan", "Balubal", "Baikingon", "Balulang", "Bayabas", "Bonbon", "Bulua",
    "Camaman-an", "Canitoan", "Carmen", "Consolacion", "Cugman", "Dansolihon",
    "F.S. Catanico", "Gusa", "Iponan", "Indahag", "Kauswagan", "Lapasan", "Lumbia",
    "Macabalan", "Macasandig", "Mambuaya", "Nazareth", "Pagalungan", "Pagatpat",
    "Patag", "Pigsag-an", "Puerto", "Puntod", "San Simon", "Taglimao", "Tagpangi",
    "Tignapoloan", "Tumpagon", "Barangay 1", "Barangay 2", "Barangay 3", 
    "Barangay 4", "Barangay 5", "Barangay 6", "Barangay 7", "Barangay 8", 
    "Barangay 9", "Barangay 10", "Barangay 11", "Barangay 12", "Barangay 13", 
    "Barangay 14", "Barangay 15", "Barangay 16", "Barangay 17", "Barangay 18", 
    "Barangay 19", "Barangay 20", "Barangay 21", "Barangay 22", "Barangay 23", 
    "Barangay 24", "Barangay 25", "Barangay 26", "Barangay 27", "Barangay 28", 
    "Barangay 29", "Barangay 30", "Barangay 31", "Barangay 32", "Barangay 33", 
    "Barangay 34", "Barangay 35", "Barangay 36", "Barangay 37", "Barangay 38", 
    "Barangay 39", "Barangay 40", "Barangay 41", "Barangay 42", "Barangay 43", 
    "Barangay 44", "Barangay 45"
  ];

  const isBuyer = userData.role === 'buyer';
  const [addressType, setAddressType] = useState(
    allowedType || (isBuyer ? 'delivery' : addressData?.address_type || 'delivery')
  );

  useEffect(() => {
    // Enforce allowedType if provided (e.g., only "pickup")
    if (allowedType) {
      setAddressType(allowedType);
      
    } else if (isBuyer) {
      setAddressType('delivery');

    } else if (settingUpShopInfo) {
      setAddressType('pickup');

    } 
  }, [allowedType, isBuyer, settingUpShopInfo]);

  useEffect(() => {
    if (modalVisible) {
      console.log('Modal opened. Current Region:', region);
    }
  }, [modalVisible]);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = response[0];
      console.log(address);
      setCity(address.city || '');
      setZipCode(address.postalCode || '');

    } catch (error) {
      Alert.alert('Error', 'Unable to retrieve address from coordinates.');
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoordinate({ latitude, longitude });
    console.log("Coordinates:", latitude, " ", longitude);
  };

  const handleSaveLocation = async () => {
    if (selectedCoordinate) { 
      const { latitude, longitude } = selectedCoordinate;
      setRegion({
        ...region,
        latitude,
        longitude,
      });

      try {
        // Perform reverse geocoding to fetch address data
        await getAddressFromCoordinates(latitude, longitude);
      } catch (error) {
        console.error('Failed to reverse geocode:', error);
      }
      setModalVisible(false);
    } else {
      Alert.alert('No location selected', 'Please tap on the map to select a location.');
    }
  }
  
  const handleSave = async () => {
    if (!addressLine1 || !city || !zipCode || !name || !phoneNumber || !barangay) {
      Alert.alert('Validation Error', 'All fields are required!');
      return;
    }

    const userId = userData.uid;
    const userAddressesRef = collection(db, `users/${userId}/addresses`);

    console.log(userId);

    try {
      const batch = writeBatch(db);
      
      if (settingUpShopInfo) {
        
        const savedAddress = {  
          name, 
          phone_number: phoneNumber, 
          address_line_1: addressLine1, 
          barangay, 
          city, 
          zip_code: zipCode, 
          address_type: addressType, 
          isdefault: isDefault,
          region 
        };
        
        console.log(savedAddress);
        navigation.navigate('ShopInfo', { addressData: savedAddress, addressSet: true });
        
        return;
      }

      if (isDefault) {
        // Reset other addresses with the same address_type to isdefault: false
        const defaultQuery = query(
          userAddressesRef,
          where('isdefault', '==', true),
          where('address_type', '==', addressType)
        );
        const defaultAddresses = await getDocs(defaultQuery);
  
        defaultAddresses.forEach((docSnapshot) => {
          if (!isEdit || docSnapshot.id !== addressData.id) {
            batch.update(docSnapshot.ref, { isdefault: false });
          }
        });
      }

      if (isEdit) {
        const docRef = doc(userAddressesRef, addressData.id);
        await updateDoc(docRef, {
          name: name,
          phone_number: phoneNumber,
          address_line_1: addressLine1,
          barangay: barangay,
          city: city,
          zip_code: zipCode,
          address_type: addressType,
          isdefault: isDefault,
          region,
        });
        Alert.alert('Success', 'Address updated successfully!');

      } else { 
  
        const newAddress = {
          name,
          phone_number: phoneNumber,
          address_line_1: addressLine1,
          barangay,
          city,
          zip_code: zipCode,
          address_type: addressType,
          isdefault: isDefault,
          region,
        };

        const newAddressRef = doc(collection(db, `users/${userId}/addresses`));
        batch.set(newAddressRef, newAddress);
      }

      await batch.commit(); 
      Alert.alert('Success', isEdit ? 'Address updated successfully!' : 'Address added successfully!');
      navigation.goBack();

    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Address' : 'Add an Address'}</Text>
        <View style={styles.headerButton}>
          <Ionicons name="add" />
        </View>
      </View>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TextInput 
          value={city}
          onChangeText={setCity} 
          style={styles.input} 
          placeholder="City"
        />
        <Picker
          selectedValue={barangay}  
          onValueChange={(itemValue) => setBarangay(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Barangay" value="" />
          {barangays.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="House Number, Street, and Apartment Number"
          value={addressLine1}
          onChangeText={setAddressLine1}
        /> 
        <TextInput
          style={styles.input}
          placeholder="Postal Code"
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.mapThumbnail} onPress={() => setModalVisible(true)}>
          <MapView
            style={styles.map}
            region={region}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker coordinate={region} />
          </MapView>
        </TouchableOpacity>
        
        <View style={styles.addressTypeContainer}>
          <Text style={styles.label}>Address Type:</Text>
          <View style={styles.radioGroup}>
            {['delivery', 'pickup', 'return'].map((type) => {
              const isDisabled =
                (allowedType && type !== allowedType) || 
                (isBuyer && type !== 'delivery') || 
                (settingUpShopInfo && allowedType === 'pickup' && type !== 'pickup');
                
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => !isDisabled && setAddressType(type)}
                  disabled={isDisabled}
                  style={[styles.radioButton, isDisabled && { opacity: 0.5 }]}
                >
                  <View style={styles.radioOuter}>
                    {addressType === type && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.radioLabel,
                      isDisabled ? { color: '#ccc' } : null,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Set as Default:</Text>
          <Switch value={isDefault} onValueChange={setIsDefault} />
        </View>
        <Button title="Save Address" onPress={handleSave} />
      </View>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <MapView 
          style={styles.fullscreenMap} 
          region={{
            ...region,
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          onPress={handleMapPress}
        >
          {selectedCoordinate && <Marker coordinate={selectedCoordinate} title='Marker' />}
        </MapView>
        <View style={styles.mapButtons}>
          <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: 'red'}]} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={handleSaveLocation}>
            <Text style={styles.buttonText}>Save Location</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2E4C2D',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  mapContainer: {
    height: 250,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  addressLink: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  link: { 
    fontSize: 16,
    color: '#007BFF', 
    textDecorationLine: 'underline',
    textAlign: 'center'
  },
  map: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  option: {
    fontSize: 16,
    color: '#555',
  },
  selected: {
    fontSize: 16,
    color: '#7A9F59',
    fontWeight: 'bold',
  },
  mapThumbnail: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,  
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden', 
    marginBottom: 20,
  },
  mapText: {
    marginTop: 10,
    color: '#333',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mapButtons: {
    position: 'absolute',
    bottom: 30, // Adjust positioning relative to the modal
    flexDirection: 'row', // To place the buttons side by side
    justifyContent: 'center', // Center the buttons horizontally
    alignSelf: 'center', // Align the container itself at the center
    gap: 30,
  },
  fullscreenModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullscreenMap: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 30,
    borderRadius: 30,
    backgroundColor: '#2196F3', // Common button style
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  mapContainer: {
    width: 300,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
  },
  fullscreenCloseButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#FF6347', // Stylish tomato red
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // For Android shadow effect
  },
  fullscreenCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addressTypeContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    width: '100%',
    height: '100%',
  },
  mapText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7A9F59',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7A9F59',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});

export default AddressForm;
