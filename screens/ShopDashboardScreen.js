import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { AuthContext } from '../providers/AuthProvider';
import { useFocusEffect } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const ShopDashboardScreen = ({ navigation }) => {
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userAuthData } = useContext(AuthContext);

  const fetchFarmerDetails = async () => {
    try {
      setLoading(true);
      const userId = userAuthData?.uid;
      if (userId) {
        const farmerRef = collection(db, 'users', userId, 'farmer_details');
        const farmerQuery = query(farmerRef, where('farmer_id', '==', userId));
        const farmerSnapshot = await getDocs(farmerQuery);

        if (!farmerSnapshot.empty) {
          const fetchedDetails = farmerSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFarmerDetails(fetchedDetails[0]);
        } else {
          console.log('No farmer details found!');
        }
      }
    } catch (error) {
      console.error('Error fetching farmer details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFarmerDetails();
  }, [userAuthData]);

  useFocusEffect(
    useCallback(() => {
      fetchFarmerDetails();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('ProfileScreen');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.shopName}>{farmerDetails?.store_name}</Text>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('UpdateShopProfile', { farmerDetails })}>
          <MaterialIcons name="account-circle" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Store Photo as Cover */}
      <ImageBackground
        source={farmerDetails?.store_photo ? { uri: farmerDetails.store_photo } : require('../images/veg.jpg')}
        style={styles.coverPhoto}
        imageStyle={styles.coverImage}
      >
        {/* Optionally, you can overlay text or elements on the cover */}
      </ImageBackground>

      {/* Store Details */}
      <View style={styles.secondContainer}>
        {/* Feature Buttons */}
        <View style={styles.featureButtonsContainer}>
          <TouchableOpacity style={styles.featureButton} onPress={() => navigation.navigate('ProductList')}>
            <MaterialIcons name="inventory" size={24} color="#FFF" />
            <Text style={styles.featureButtonText}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureButton} onPress={() => navigation.navigate('OrderList')}>
            <MaterialIcons name="local-shipping" size={24} color="#FFF" />
            <Text style={styles.featureButtonText}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureButton} onPress={() => navigation.navigate('Addresses')}>
            <MaterialIcons name="location-on" size={24} color="#FFF" />
            <Text style={styles.featureButtonText}>Addresses</Text>
          </TouchableOpacity>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Store Description:</Text>
          <Text style={styles.detailValue}>{farmerDetails?.store_description || 'No description provided.'}</Text>

          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{farmerDetails?.phone_number || 'Not available'}</Text>

          <Text style={styles.detailLabel}>Approval Status:</Text>
          <Text style={[styles.detailValue, farmerDetails?.approval_status === 'approved' ? styles.approved : styles.pending]}>
            {farmerDetails?.approval_status?.toUpperCase() || 'Pending'}
          </Text>
        </View>

        {/* Pickup Address */}
        <View style={styles.addressContainer}>
          <Text style={styles.sectionTitle}>Default Pickup Address</Text>
          {farmerDetails?.default_pickup_address ? (
            <>
              <Text style={styles.addressField}>{farmerDetails.default_pickup_address.name}</Text>
              <Text style={styles.addressField}>
                {farmerDetails.default_pickup_address.address_line_1}, {farmerDetails.default_pickup_address.barangay}
              </Text>
              <Text style={styles.addressField}>
                {farmerDetails.default_pickup_address.city}, {farmerDetails.default_pickup_address.zip_code}
              </Text>
              <Text style={styles.addressField}>Phone: {farmerDetails.default_pickup_address.phone_number}</Text>
            </>
          ) : (
            <Text style={styles.addressField}>No default pickup address provided.</Text>
          )}
        </View>

        {/* Switch to Buyer Role Button */}
        <View style={styles.switchRoleContainer}>
          <TouchableOpacity style={styles.switchRoleButton} onPress={() => navigation.navigate('BottomTabs')}>
            <Text style={styles.switchRoleText}>Switch to Buyer Profile</Text>
          </TouchableOpacity>
        </View>

       
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Ensures the ScrollView scrolls
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E4C2D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2E4C2D',
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  shopName: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 50,
  },
  coverPhoto: {
    width: '100%',
    height: 250,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  coverImage: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  secondContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  featureButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  featureButton: {
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 15,
    width: 100,
    height: 100,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  featureButtonText: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  detailValue: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  approved: {
    color: '#4CAF50',
  },
  pending: {
    color: '#F57C00',
  },
  addressContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  addressField: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  switchRoleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchRoleButton: {
    backgroundColor: '#FF5722',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchRoleText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
 
});

export default ShopDashboardScreen;
