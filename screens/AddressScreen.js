import React, { useEffect, useState, useContext, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { AuthContext } from '../providers/AuthProvider';
import { collection, getDocs, getDoc, updateDoc, doc, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const AddressScreen = ({ navigation }) => {
  
  const { userAuthData, userData, setUserData } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const userId = userData.uid;
      const userAddressesRef = collection(db, `users/${userId}/addresses`);
      const querySnapshot = await getDocs(userAddressesRef);

      const fetchedAddresses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAddresses(fetchedAddresses);

    } catch (error) {
      console.error('Error fetching addresses:', error);

    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const userId = userData.uid;
      const userDocRef = doc(db, 'users', userId);
      const docSnapShot = await getDoc(userDocRef);

      // Check if the document exists
      if (docSnapShot.exists()) { 
        const userData = { id: docSnapShot.id, ...docSnapShot.data() };
        setUserData(userData); 
        console.log('User Document:', userData);
      }
      
      console.log(userData);
      
    } catch (error) {
      console.error('Error fetching addresses:', error);

    } finally {
      setLoading(false);
    }
  };

  const updateFarmerDetails = async (defaultAddress) => {
    try {
      const farmerDetailsRef = collection(db, `users/${userData.uid}/farmer_details`);
      const farmerQuery = query(farmerDetailsRef, where('email', '==', userData.email));
      const farmerDetailsSnapshot = await getDocs(farmerQuery);

      if (!farmerDetailsSnapshot.empty) {
        const farmerDoc = farmerDetailsSnapshot.docs[0]; // Assuming email is unique
        const farmerDocRef = doc(db, `users/${userData.uid}/farmer_details`, farmerDoc.id);

        await updateDoc(farmerDocRef, {
          default_pickup_address: defaultAddress,
        });
      }

    } catch (error) {
      console.error('Error updating farmer details:', error);
    }
  };

  const setDefaultAddress = async (addressId, addressType) => {
    try {
      const userId = userData.uid;

      // Reset all other addresses to `isdefault: false`
      const updates = addresses
        .filter(address => address.address_type === addressType)
        .map(address =>
          updateDoc(doc(db, `users/${userId}/addresses`, address.id), {
            isdefault: address.id === addressId,
          })
        );
        
      await Promise.all(updates);

      const newDefaultAddress = addresses.find(address => address.id === addressId);

      if (addressType === 'pickup' && newDefaultAddress) {
        const defaultAddress = {
          id: newDefaultAddress.id,
          name: newDefaultAddress.name,
          phone_number: newDefaultAddress.phone_number,
          address_line_1: newDefaultAddress.address_line_1,
          barangay: newDefaultAddress.barangay,
          city: newDefaultAddress.city,
          zip_code: newDefaultAddress.zip_code,
          address_type: newDefaultAddress.address_type,
          region: newDefaultAddress.region,
        };

        await updateFarmerDetails(defaultAddress);
      }

      fetchAddresses();

    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const userId = userData.uid;
      await deleteDoc(doc(db, `users/${userId}/addresses`, addressId));
      setAddresses(prevAddresses => prevAddresses.filter(address => address.id !== addressId));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const confirmDeleteAddress = (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteAddress(addressId) }
      ]
    );
  };

  useEffect(() => {
    fetchAddresses();
    fetchUserData();
  }, [userAuthData]);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();  // Re-fetch addresses when returning from AddressForm
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2E4C2D" />
      </View>
    );
  }

  return (
    <View contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Address</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddressForm')} style={styles.headerButton}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Address Details */}
      <ScrollView style={styles.detailsContainer}>
        {addresses.length > 0 ? (
          addresses.map(address => (
            <View key={address.id} style={styles.detailRow}>
              <Ionicons name="location-outline" size={24} color="#2E4C2D" />
              <View style={styles.detailTextContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.detailText}>{address.name}</Text>
                  <Text style={styles.typeText}>Type: ({address.address_type})</Text>
                </View>
                <Text style={styles.subText}>Phone: {address.phone_number}</Text>
                <Text style={styles.subText}>
                  Address: {address.address_line_1}, {address.barangay}, {address.city}, {address.zip_code}
                </Text>
                {address.isdefault && <Text style={styles.defaultBadge}>Default</Text>}
              </View>
              <View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('AddressForm', { isEdit: true, addressData: address })}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                {!address.isdefault && (
                  <TouchableOpacity
                    style={styles.defaultButton}
                    onPress={() => setDefaultAddress(address.id, address.address_type)}
                  >
                    <Text style={styles.defaultText}>Set as Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDeleteAddress(address.id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noAddressesText}>No addresses available. Add one!</Text>
        )}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8D6C5', // Light green for the background
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  detailsContainer: {
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    marginBottom: 10,
  },
  detailTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#2E4C2D',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
  editButton: {
    alignItems: 'flex-end',
  },
  editText: {
    color: '#2E4C2D',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteButton: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  deleteText: {
    color: '#FF3B3B',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AddressScreen;
