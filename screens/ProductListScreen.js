import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, ImageBackground, Alert } from 'react-native';
import { AuthContext } from '../providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ProductListScreen = ({ navigation }) => {

  const { userData } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [farmerDetails, setFarmerDetails] = useState('');

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        const farmerCollectionRef = collection(db, 'users', userData.uid, 'farmer_details');
        const q = query(farmerCollectionRef, where("email", "==", userData.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const data = docSnap.data();
          setFarmerDetails(data);
        }

      } catch (error) {
        console.error('Error fetching farmer details:', error.message);
      }
    };

    const fetchProducts = async () => {
      try {
        const userId = userData.uid;

        const productQuery = query(
          collection(db, 'products'),
          where('farmer_id', '==', userId) 
        );

        const productSnapshot = await getDocs(productQuery);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching products: ', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load products.');
      }
    };

    fetchProducts();
    fetchFarmerDetails();
  }, [userData.uid]);

  const deleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(product => product.id !== productId));
      Alert.alert('Success', 'Product deleted successfully.');
    } catch (error) {
      console.error('Error deleting product: ', error);
      Alert.alert('Error', 'Failed to delete product.');
    }
  };

  const confirmDelete = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteProduct(productId), style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ShopDashboard')}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Header with Background Image (Shop photo as cover) */}
      <ImageBackground
        source={{ uri: farmerDetails.store_photo || 'https://via.placeholder.com/200' }}  // Shop photo as background
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Product"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Shop Header (No photo here anymore) */}
        <View style={styles.shopHeader}>
          <View style={styles.shopInfo}>
            <TouchableOpacity onPress={() => navigation.navigate('ShopDashboard')}>
              <Text style={styles.shopName}>{farmerDetails.store_name}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* The rest of the component remains the same */}
      {/* Product Tab */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
            <Text style={styles.tabTextActive}>All Products</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Product Count */}
      <View style={styles.productCountContainer}>
        <Text style={styles.productCountText}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
        </Text>
      </View>

      {/* Product Grid */}
      <View style={styles.productGrid}>
        {loading ? (
          <Text>Loading...</Text>
        ) : filteredProducts.length === 0 ? (
          <>
            <Text>No products found</Text>
            <TouchableOpacity style={styles.addProductButton} onPress={() => navigation.navigate('AddProduct')}>
              <Text style={styles.addProductText}>Add Product</Text>
            </TouchableOpacity>
          </>
        ) : (
          filteredProducts.map((product) => (
            <View style={styles.productCard} key={product.id}>
              <Image
                source={{ uri: product.product_image || 'https://via.placeholder.com/100' }}
                style={styles.productImage}
              />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productInfo}>{product.stock} pieces left</Text>
              <Text style={styles.productPrice}>₱{product.price}</Text>
              <View style={styles.productActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('AddProduct', { product, isEdit: true })}
                >
                  <Ionicons name="pencil" size={20} color="#2E4C2D" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDelete(product.id)}
                >
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 5,
    backgroundColor: 'transparent', 
  },

  backgroundImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 25,
    width: '90%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#302f2f',
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 130,
  },
  shopInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 15,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E4C2D',
  },
  tabTextActive: {
    color: '#2E4C2D',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productCountContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  productCountText: {
    fontSize: 12,
    color: '#333',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  productInfo: {
    fontSize: 12,
    color: '#777',
    marginBottom: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E4C2D',
    marginBottom: 10,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  editButton: {
    padding: 5,
    alignItems: 'center',
  },
  deleteButton: {
    padding: 5,
  },
  addProductButton: {
    backgroundColor: '#2E4C2D',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addProductText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default ProductListScreen;
