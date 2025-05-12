import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const UpdateShopProfileScreen = ({ route, navigation }) => {
  const { farmerDetails } = route.params;
  const [storeName, setStoreName] = useState(farmerDetails.store_name || '');
  const [storeDescription, setStoreDescription] = useState(farmerDetails.store_description || '');
  const [phoneNumber, setPhoneNumber] = useState(farmerDetails.phone_number || '');
  const [storePhoto, setStorePhoto] = useState(farmerDetails.store_photo || '');

  const handleSaveChanges = async () => {
    try {
      const farmerRef = doc(db, 'users', farmerDetails.farmer_id, 'farmer_details', farmerDetails.id);
      await updateDoc(farmerRef, {
        store_name: storeName,
        store_description: storeDescription,
        phone_number: phoneNumber,
        store_photo: storePhoto,
      });
      alert('Changes saved successfully!');
      navigation.goBack(); // Navigate back to ShopDashboardScreen
    } catch (error) {
      console.error('Error updating store details:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setStorePhoto(result.assets[0].uri); // Set the selected image URI
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2E4C2D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Shop Profile</Text>
      </View>

      {/* Email Display */}
      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.readOnly]}
          value={farmerDetails.email || 'No email available'}
          editable={false}
        />
      </View>

      {/* Store Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Store Name</Text>
        <TextInput
          style={styles.input}
          value={storeName}
          onChangeText={setStoreName}
          placeholder="Enter store name"
        />
      </View>

      {/* Store Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Store Description</Text>
        <TextInput
          style={styles.textArea}
          value={storeDescription}
          onChangeText={setStoreDescription}
          placeholder="Enter store description"
          multiline
        />
      </View>

      {/* Phone Number */}
      <View style={styles.field}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />
      </View>

      {/* Store Photo */}
      <View style={styles.imageSection}>
        <Text style={styles.label}>Store Photo</Text>
        <TouchableOpacity onPress={handlePickImage}>
          {storePhoto ? (
            <Image source={{ uri: storePhoto }} style={styles.storePhoto} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image" size={50} color="#A9A9A9" />
              <Text style={styles.addButtonText}>+ Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Save Changes Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C8D6C5',
    padding: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E4C2D',
    marginLeft: 10,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#2E4C2D',
  },
  input: {
    borderWidth: 1,
    borderColor: '#A9A9A9',
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#A9A9A9',
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
  },
  readOnly: {
    color: '#888',
    backgroundColor: '#F0F0F0',
  },
  imageSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  storePhoto: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: '#A9A9A9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  addButtonText: {
    fontSize: 14,
    color: '#A9A9A9',
    textAlign: 'center',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#2E4C2D',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateShopProfileScreen;
