import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator, 
  Image 
} from 'react-native';
import { db } from '../firebaseConfig'; 
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc} from 'firebase/firestore';
import { AuthContext } from '../providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 2 - 30;

export default function AllShopsScreen({ navigation }) {
  const { userData, userAuthData } = useContext(AuthContext);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const storeList = [];
        for (const userDoc of usersSnapshot.docs) {
          const farmerDetailsRef = collection(db, `users/${userDoc.id}/farmer_details`);
          const farmerSnapshot = await getDocs(farmerDetailsRef);
          farmerSnapshot.forEach((farmerDoc) => {
            storeList.push({
              id: farmerDoc.id,
              ...farmerDoc.data(),
              farmer_id: userDoc.id 
            });
          });
        }
        const filteredStores = storeList.filter((store) =>
          store.farmer_id !== userAuthData.uid && store.store_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setStores(filteredStores);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, userAuthData.uid]);

  const filteredStores = stores.filter((store) =>
    store.store_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStore = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.shopCard} 
        onPress={() => navigation.navigate('BuyerShopDashboard', { farmerDetails: item })}>
        {item.store_photo && !imageError ? (
          <Image  
            source={{ uri: item.store_photo }}
            style={styles.shopImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Ionicons name="storefront-outline" size={40} color="#555" style={styles.shopIcon} />
        )}
        <View style={styles.shopDetails}>
          <Text style={styles.shopName}>{item.store_name}</Text>
          <Text style={styles.shopLocation}>{item.store_description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#7A9F59" />
      <LinearGradient colors={['#7A9F59', '#fff']} style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="#fff" />
            <View>
              <Text style={styles.locationText}>
                {userData?.first_name || userData?.last_name
                  ? `${userData.first_name ?? ''} ${userData.last_name ?? ''}`.trim()
                  : userData?.email || 'Guest User'}
              </Text>
              <Text style={styles.locationSubText}>Cagayan de Oro Misamis Oriental</Text>
            </View>
          </View>
          <View style={styles.topIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Favourites')}>
              <Ionicons name="heart-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <Ionicons name="cart-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search for shops..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
    
        {/* Content Scrollable View */}
        {loading ? (
          <View style={styles.loadingWrapper}> 
            <ActivityIndicator size="large" color="#006400" />
          </View>
        ) : (
          <View style={{ flex: 1, marginTop: 15 }}>
          <FlatList
            data={filteredStores}
            renderItem={renderStore}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.shopList}
          />
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#7A9F59',
  },
  container: {
    flex: 1,
  },
  loadingWrapper: {
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight - 20 : 20,
    paddingBottom: 10,
    backgroundColor: '#7A9F59',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  locationSubText: {
    color: '#ddd',
    fontSize: 12,
    marginLeft: 5,
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 70,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 20,
  },
  imagePlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    marginBottom: 10,
  },
  shopList: {
    paddingHorizontal: 10,
  },
  shopCard: {
    width: cardWidth,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  shopImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  shopIcon: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  shopDetails: {
    marginTop: 10,
    alignItems: 'center',
  },
  shopName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  shopLocation: {
    fontSize: 12,
    color: '#888',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  viewAllText: {
    fontSize: 16,
    color: '#2E4C2D', // Match this with your color scheme
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Optional, to give a hyperlink look
  },
});
