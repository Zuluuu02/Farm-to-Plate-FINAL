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
  Image,
  Animated
} from 'react-native';
import { db } from '../firebaseConfig'; 
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, onSnapshot, runTransaction } from 'firebase/firestore';
import { AuthContext } from '../providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 2 - 20;

export default function HomeScreen({ navigation }) {
  const { userData, userAuthData } = useContext(AuthContext);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [stores, setStores] = useState([]);
  const [assistantExpanded, setAssistantExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isFavourite: likedProducts.has(doc.id),
        }));

        const filteredProducts = productsList.filter((product) => 
          product.farmer_id !== userAuthData.uid
        );
        setProducts(filteredProducts);

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
          store.farmer_id !== userAuthData.uid &&
          store.store_name.toLowerCase().includes(searchQuery.toLowerCase())
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

  useEffect(() => {
    const userId = userAuthData.uid;
    const likedProductsRef = collection(db, `users/${userId}/liked_products`);

    const unsubscribe = onSnapshot(likedProductsRef, (snapshot) => {
      const likes = new Set(snapshot.docs.map((doc) => doc.data().product_id));
      setLikedProducts(likes);
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          isFavourite: likes.has(p.id),
        }))
      );
    });

    return () => unsubscribe();
  }, [userAuthData.uid]);

  const toggleFavourite = async (product) => {
    try {
      const userId = userAuthData.uid;
      const favouritesRef = collection(db, `users/${userId}/liked_products`);
      const likedRef = doc(favouritesRef, product.id);
      const productRef = doc(db, 'products', product.id);

      await runTransaction(db, async (transaction) => {
        const productSnapshot = await transaction.get(productRef);
        const currentLikesCount = productSnapshot.data()?.likes_count || 0;

        if (product.isFavourite) {
          transaction.delete(likedRef);
          transaction.update(productRef, { likes_count: currentLikesCount - 1 });
        } else {
          transaction.set(likedRef, {
            product_id: product.id,
            name: product.name,
            category: product.category || 'Uncategorized',
            price: product.price,
            description: product.description || '',
            stock: product.stock,
            liked_at: new Date().toISOString(),
          });
          transaction.update(productRef, { likes_count: currentLikesCount + 1 });
        }
      });

      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, isFavourite: !item.isFavourite } : item
        )
      );
    } catch (error) {
      console.error('Error toggling favourite:', error);
    }
  };

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStores = stores.filter((store) =>
    store.store_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <TouchableOpacity style={styles.favouriteIcon} onPress={() => toggleFavourite(item)}>
        <Ionicons
          name={item.isFavourite ? 'heart' : 'heart-outline'}
          size={24}
          color={item.isFavourite ? '#E63946' : 'black'}
        />
      </TouchableOpacity>
      {item.product_image ? (
        <Image source={{ uri: item.product_image }} style={styles.productImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={50} color="#555" />
        </View>
      )}
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>₱ {item.price}</Text>
      <Text style={styles.productSold}>Stock: {item.stock}</Text>
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Text style={styles.viewDetailsText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStore = ({ item }) => (
    <TouchableOpacity style={styles.shopCard} onPress={() => navigation.navigate('BuyerShopDashboard', { farmerDetails: item })}>
      {item.store_photo && !imageError ? (
        <Image
          source={{ uri: item.store_photo }}
          style={styles.shopImage}
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
            placeholder="Search for products or shops..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#006400" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Products</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllProducts')}>
                <Text style={styles.viewAllText}>View All Products</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productList}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Shops</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllShops')}>
                <Text style={styles.viewAllText}>View All Shops</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredStores}
              renderItem={renderStore}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.shopList}
            />
          </ScrollView>
        )}

        {/* 🧠 Virtual Assistant Floating Button */}
        <TouchableOpacity
          style={styles.virtualAssistantButton}
          onPress={() => navigation.navigate('VirtualAssistantScreen')}
        >
          <Ionicons
            name={assistantExpanded ? 'chatbox-ellipses' : 'chatbox'}
            size={assistantExpanded ? 40 : 30}
            color="white"
          />
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  virtualAssistantButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
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
  productList: {
    paddingHorizontal: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 10,
    width: cardWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  favouriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  productImage: {
    width: '100%',
    height: 100, 
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  productSold: {
    fontSize: 12,
    color: '#888',
  },
  viewDetailsButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2E4C2D',
    borderRadius: 5,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#FFF',
    fontWeight: 'bold',
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
    fontSize: 12,
    color: '#2E4C2D', 
    fontWeight: 'bold',
    textDecorationLine: 'underline',  
  },
});
