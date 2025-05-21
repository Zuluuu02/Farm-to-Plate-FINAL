import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { addDoc, collection, doc } from "firebase/firestore";
import { useContext, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from "../firebaseConfig";
import { AuthContext } from '../providers/AuthProvider';

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const { userAuthData } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState(null); 
  const [quantity, setQuantity] = useState(1);

  const goToAddToCart = () => {
    setActionType('addToCart');
    setModalVisible(true);
  };

  const goToBuyNow = () => {
    setActionType('buyNow');
    setModalVisible(true);
  };

  const handleAddToCart = async () => {
    try {
      const userId = userAuthData.uid;
      const cartItemsRef = collection(doc(db, "users", userId), "cart_items");
  
      const cartItem = {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.product_image || " ",
        created_at: new Date(),
        subtotal: product.price * quantity
      };
  
      await addDoc(cartItemsRef, cartItem);
  
      navigation.navigate("Cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleModalAction = () => {
    setModalVisible(false);
    if (actionType === 'addToCart') {
      handleAddToCart();
    } else if (actionType === 'buyNow') {
      navigation.navigate('Product', {
        product,
        quantityFromDetailsScreen: quantity,
      });
    }
  };

  return (
    <LinearGradient colors={['#7A9F59', '#fff']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Product Details</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          {product.product_image ? (
            <Image
              source={{ uri: product.product_image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No Image Available</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          {/* Product Title and Category */}
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.categoryAndLikes}>
            <Text style={styles.productCategory}>
              {product.category || 'Uncategorized'}
            </Text>
            <View style={styles.likesContainer}>
              <Ionicons name="heart-outline" size={20} color="#E63946" />
              <Text style={styles.likesCount}>{product.likes_count || 0} likes</Text>
            </View>
          </View>

          {/* Price and Stock */}
          <Text style={styles.productPrice}>₱ {product.price}</Text>
          <Text style={styles.productStock}>Stock: {product.stock}</Text>

          {/* Description */}
          <Text style={styles.sectionTitle}>Product Description</Text>
          <Text style={styles.productDescription}>
            {product.description || 'No description available'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.addToCartButton} onPress={goToAddToCart}>
          <Ionicons name="cart-outline" size={20} color="#fff" style={styles.cartIcon} />
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={goToBuyNow}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.buyNowModalContainer}>
          <View style={styles.buyNowModalContent}>
            <TouchableOpacity
              style={styles.closeButtonTopLeft}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            {/* Product Image and Details */}
            <Image
              source={{ uri: product.product_image }}
              style={styles.modalProductImage}
            />
            <Text style={styles.modalProductName}>{product.name}</Text>
            <Text style={styles.modalProductStock}>Stock: {product.stock}</Text>
            <Text style={styles.modalProductPrice}>₱ {product.price}</Text>

            {/* Quantity Selector */}
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityText}>Quantity:</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(quantity - 1, 1))}
              >
                <Ionicons name="remove" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.quantityNumber}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Buy Now Button */}
            <TouchableOpacity
              style={styles.ModalbuyNowButton}
              onPress={handleModalAction}
            >
              <Text style={styles.buyNowButtonText}>{actionType === 'addToCart' ? 'Add to Cart' : 'Buy Now'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  imageContainer: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    marginBottom: 10,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 300,
  },
  imagePlaceholder: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 18,
    color: '#888',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  categoryAndLikes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  productCategory: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  productPrice: {
    fontSize: 20,
    color: '#4caf50',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productStock: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  productDescription: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 20,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#4caf50',
    borderRadius: 5,
    paddingVertical: 15,
  },
  cartIcon: {
    marginRight: 8,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#e63946',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyNowModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buyNowModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  closeButtonTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  modalProductImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalProductPrice: {
    fontSize: 16,
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalProductStock: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  quantityText: {
    fontSize: 18,
    color: '#333',
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: '#7A9F59',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginHorizontal: 10,
  },
  ModalbuyNowButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buyNowButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
