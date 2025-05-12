import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, ActivityIndicator, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../firebaseConfig'; 
import { collection, getDocs, query, where, setDoc, doc, onSnapshot, getDoc, updateDoc, deleteDoc, runTransaction } from 'firebase/firestore';
import { AuthContext } from '../providers/AuthProvider';  
import { Ionicons } from '@expo/vector-icons';

const BuyerShopDashboardScreen = ({ navigation, route }) => {
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [storeInfo, setStoreInfo] = useState(route.params?.farmerDetails);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { userAuthData, userData } = useContext(AuthContext); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const farmerId = storeInfo?.farmer_id;
        if (!farmerId) return;

        const productsRef = collection(db, 'products');
        const productsQuery = query(
          productsRef,
          where('farmer_id', '==', farmerId)
        );
        const productsSnapshot = await getDocs(productsQuery);

        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isFavourite: likedProducts.has(doc.id),
        }));
        setFarmerProducts(productsList);

      } catch (error) {
        console.error('Error fetching data:', error);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeInfo, userAuthData.uid]);

  useEffect(() => {
    const userId = userAuthData.uid;
    const likedProductsRef = collection(db, `users/${userId}/liked_products`);

    const unsubscribe = onSnapshot(likedProductsRef, (snapshot) => {
      const likes  = new Set(snapshot.docs.map((doc) => doc.data().product_id));
      setLikedProducts(likes);
      
      setFarmerProducts((prevProducts) =>
        prevProducts.map((product) => ({
          ...product,
          isFavourite: likes.has(product.id),
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
            // If already liked, remove from favourites
            transaction.delete(likedRef);
            transaction.update(productRef, { likes_count: currentLikesCount - 1 });
            console.log('Removed from favourites:', product.name);
          } else {
            // Add to favourites
            transaction.set(likedRef, {
              product_id: product.id,
              name: product.name,
              category: product.category || 'Uncategorized',
              price: product.price,
              description: product.description || 'No description available',
              stock: product.stock,
              liked_at: new Date().toISOString(),
            });
            transaction.update(productRef, { likes_count: currentLikesCount + 1 });
            console.log('Added to favourites:', product.name);
          }
        });
    
        setFarmerProducts((prevProducts) =>
          prevProducts.map((item) =>
            item.id === product.id
              ? { ...item, isFavourite: !item.isFavourite }
              : item
          )
        );
      } catch (error) {
        console.error('Error toggling favourite:', error);
      }
    };


  const handleCreateChatRoom = async () => {
    const buyerId = userAuthData?.uid; 
    const farmerId = storeInfo?.farmer_id;

    if (!buyerId || !farmerId) return;

    const chatRef = collection(db, 'chat_rooms');
    const chatQuery = query(
      chatRef, 
      where('buyer_id', '==', buyerId),
      where('farmer_id', '==', farmerId)
    );

    const chatSnapshot = await getDocs(chatQuery);
    
    if (chatSnapshot.empty) {
      // If no chat room exists, create one
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        buyer_id: buyerId,
        buyer_name: 
          userData.first_name && userData.last_name 
            ? `${userData.first_name} ${userData.last_name}` 
            : userData.email,
        farmer_id: farmerId,
        store_name: storeInfo.store_name, 
        createdAt: new Date(),
        status: 'active',
      });

      navigation.navigate('ChatRoom', { chatId: newChatRef.id, name: storeInfo.store_name });
    } else {
      const existingChat = chatSnapshot.docs[0].data();
      navigation.navigate('ChatRoom', { chatId: chatSnapshot.docs[0].id, name: storeInfo.store_name });
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        style={styles.favouriteIcon}
        onPress={() => toggleFavourite(item)}
      > 
        <Ionicons
          name={item.isFavourite ? 'heart' : 'heart-outline'}
          size={24}
          color={item.isFavourite ? '#E63946' : 'black'}
        />
      </TouchableOpacity>
      <View style={styles.imagePlaceholder}>
        <MaterialIcons name="image" size={50} color="#555" />
      </View>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>₱ {item.price}</Text>
      <Text style={styles.productSold}>Stock: {item.stock}</Text>

      {/* View Details Button */}
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Text style={styles.viewDetailsText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View contentContainerStyle={styles.container}>
      {storeInfo && (
        <View style={styles.header}>
          <Text style={styles.shopName}>{storeInfo.store_name}</Text>
          <TouchableOpacity
            onPress={handleCreateChatRoom}
            style={styles.chatIconContainer}
          >
            <MaterialIcons name="chat" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
      <ImageBackground
        source={require('../images/veg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
      </ImageBackground>

      {/* Products Display */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E4C2D" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <>
          {farmerProducts.length > 0 ? (
            <View style={styles.productListContainer}>
              <FlatList 
                data={farmerProducts} 
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.productList}
              />
            </View>
          ) : (
            <View style={styles.noProductsTextContainer}>
              <Text style={styles.noProductsText}>No products available.</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F4F0',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#2E4C2D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',  
  },
  shopName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    flexShrink: 1
  },
  chatIconContainer: {
    padding: 5, 
  },
  backgroundImage: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  productListContainer: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',    
    flexWrap: 'wrap',        
    justifyContent: 'center', 
  },
  productCard: {
    backgroundColor: '#FFF',
    padding: 15,
    marginHorizontal: 5,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    width: '48%',           // Make each product take 48% of the row width
    marginBottom: 15,       // Margin to create space between rows
  },
  favouriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  imagePlaceholder: {
    height: 100,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  productSold: {
    fontSize: 12,
    color: '#888',
  },
  noProductsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    alignSelf: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
});

export default BuyerShopDashboardScreen;
