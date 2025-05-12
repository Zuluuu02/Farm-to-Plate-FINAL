import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';

export default function FavouritesScreen({ navigation }) {

  const {userAuthData} = useContext(AuthContext);

  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!userAuthData?.uid) {
        return;
      }

      const fetchFavourites = async () => {
        setLoading(true);
        try {
          const likedProductsRef = collection(db, `users/${userAuthData.uid}/liked_products`);
          const snapshot = await getDocs(likedProductsRef);

          const likedProducts = snapshot.docs.map((doc) => ({
            id: doc.id,  // Firebase assigns this automatically
            ...doc.data(),
          }));

          setFavourites(likedProducts);
          
        } catch (error) {
          console.log('Error fetching favourites:', error);
          
        } finally {
          setLoading(false);
        }
      };

      fetchFavourites();

      return () => {
        // Clean up or reset state if needed (optional)
      };
    }, [userAuthData?.uid])
  );

  {/*useEffect(() => {
    if (!userAuthData?.uid) {
      return; 
    }

    const fetchFavourites = async () => {
      setLoading(true);
      try {
        const likedProductsRef = collection(db,`users/${userAuthData.uid}/liked_products`);
        const snapshot = await getDocs(likedProductsRef);

        const likedProducts = snapshot.docs.map(doc => ({
          id: doc.id,  // Firebase assigns this automatically, or you can use it as the key
          ...doc.data()
        }));
        
        setFavourites(likedProducts);
      } catch (error) {
        console.log('Error fetching favourites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [userAuthData?.uid]);*/}

  const removeFavourite = async (item) => {
    setLoading(true);
    try {
      const itemRef = doc(db, `users/${userAuthData.uid}/liked_products`, item.id);
      await deleteDoc(itemRef); 

      setFavourites((prevFavourites) =>
        prevFavourites.filter((favourite) => favourite.id !== item.id)
      );
      
    } catch (error) {
      console.error('Error removing item from favourites:', error);
    } finally { 
      setLoading(false);
    }
  };

  // Function to remove an item from favourites
  const handleRemoveItem = (item) => {
    Alert.alert(
      'Remove Favourite',
      `Are you sure you want to remove ${item.name} from favourites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFavourite(item),
        },
      ]
    );
  };

  const renderFavouriteItem = ({ item }) => (
    <View style={styles.favouriteItem}>
      <Ionicons name="image-outline" size={50} color="#4CAF50" style={styles.itemIcon} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₱ {item.price}</Text>
        <Text style={styles.productSold}>Stock: {item.stock}</Text>
      </View>
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Text style={styles.viewDetailsButtonText}>View Details</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item)}
      >
        <Ionicons name="trash-outline" size={24} color="#E63946" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Favourites</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="cart-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#006400" />
          </View>
        ) : favourites.length > 0 ? (
          <FlatList
            data={favourites}
            renderItem={renderFavouriteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.favouritesList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart" size={100} color="#4CAF50" style={styles.emptyIcon} />
            <Text style={styles.heading}>No favourites saved</Text>
            <Text style={styles.subText}>
              To make ordering even faster, you’ll find all your faves here. Just look for the heart icon!
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.buttonText}>Let’s find some favourites</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#C8D6C5',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2E4C2D',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
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
    zIndex: 1, 
  },
  favouritesList: {
    paddingBottom: 20,
  },
  favouriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  itemIcon: {
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 5,
  },
  productSold: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  viewDetailsButton: {
    backgroundColor: '#2E4C2D',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10, // Add space between the buttons
  },
  viewDetailsButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
