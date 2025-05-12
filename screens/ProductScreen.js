import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { AuthContext } from '../providers/AuthProvider';
import { db } from '../firebaseConfig';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ProductScreen = ({ route, navigation }) => {

  const { userData, userAuthData } = useContext(AuthContext);
  const { product, quantityFromDetailsScreen } = route.params;  
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [subTotal, setSubTotal] = useState(isNaN(product.price) || product.price <= 0 ? 0 : parseFloat(product.price));
  const [voucher, setVoucher] = useState(null); // to hold the applied voucher
  const [vouchers, setVouchers] = useState([]); // to hold the available vouchers
  const [deliveryFee] = useState(100); // Static delivery fee
  const [adjustedDeliveryFee, setAdjustedDeliveryFee] = useState(deliveryFee);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!isNaN(product.price) && product.price > 0 && quantityFromDetailsScreen > 0) {
      setSubTotal(product.price * quantityFromDetailsScreen); // Using quantity from ProductDetailsScreen
    }
  }, [quantityFromDetailsScreen, product.price]);

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        const farmerRef = collection(db, `users/${product.farmer_id}/farmer_details`);
        const q = query(farmerRef, where('farmer_id', '==', product.farmer_id));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setFarmerDetails(doc.data());
          });
        } else {
          console.log('No matching farmer found');
          Alert.alert('Error', 'Store not found for this product');
        }

      } catch (error) {
        console.error('Error fetching farmer details: ', error);
        Alert.alert('Error', 'There was an error fetching the farmer details');
      }
    };

    fetchFarmerDetails();
  }, [product.farmer_id]);

  const handleVoucherFetch = async () => {
    try {
      const vouchersRef = collection(db, 'voucher');
      const querySnapshot = await getDocs(vouchersRef);
      const fetchedVouchers = [];

      querySnapshot.forEach((doc) => {
        fetchedVouchers.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setVouchers(fetchedVouchers);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching vouchers: ', error);
      Alert.alert('Error', 'There was an error fetching the vouchers');
    }
  };

  const handleVoucherApply = (selectedVoucher) => {
    const currentDate = new Date();
    const expiryDate = selectedVoucher.expiry_date.toDate();

    if (expiryDate < currentDate) {
      Alert.alert('Voucher Expired', 'This voucher has expired.');
      return;
    }

    if (subTotal < selectedVoucher.discount.min_spend) {
      Alert.alert('Minimum Spend Required', `This voucher requires a minimum spend of ₱${selectedVoucher.discount.min_spend}.`);
      return;
    }

    if (selectedVoucher.type === 'delivery') {
      // Calculate the delivery fee discount
      const discountAmount = Math.min(
        selectedVoucher.discount.type === 'percentage'
          ? (deliveryFee * selectedVoucher.discount.amount) / 100
          : selectedVoucher.discount.amount,
        deliveryFee
      );

      const newDeliveryFee = Math.max(0, deliveryFee - discountAmount);
      setAdjustedDeliveryFee(newDeliveryFee);
      setVoucher({
        ...selectedVoucher,
        discount_amount: discountAmount,
        discount_type: 'delivery',
      });
      
      Alert.alert('Delivery Discount Applied', `You get ₱${discountAmount.toFixed(2)} off on delivery.`);
    } else if (selectedVoucher.type === 'subtotal') {
      const discountAmount =
        selectedVoucher.discount.type === 'percentage'
          ? (subTotal * selectedVoucher.discount.amount) / 100
          : selectedVoucher.discount.amount;

      setVoucher({
        ...selectedVoucher,
        discount_amount: discountAmount,
        discount_type: 'subtotal',
      });
  
      Alert.alert('Subtotal Discount Applied', `You get ₱${discountAmount.toFixed(2)} off your subtotal.`);
      setSubTotal((prevSubTotal) => prevSubTotal - discountAmount);
    }
    setModalVisible(false);
  };

  const handleCheckout = async () => {
    if (!userData) {
      Alert.alert('Error', 'Please log in to place an order');
      return;
    }

    if (!farmerDetails || !farmerDetails.default_pickup_address) {
      Alert.alert('Error', 'Unable to retrieve store pickup address');
      return;
    }

    const effectiveDeliveryFee =
      voucher && voucher.discount_type === 'delivery'
        ? Math.max(deliveryFee - voucher.discount_amount, 0) // Prevent negative fees
        : deliveryFee;

    const totalAmount =
      (voucher && voucher.discount_type === 'subtotal' ? subTotal : subTotal) + effectiveDeliveryFee;

    console.log(product);
    const orderId = `${userAuthData.uid}_${new Date().getTime()}`;
    const order = {
      user_id: userAuthData.uid,
      user_name: userData.first_name + userData.last_name || 'NoName',
      user_email: userData.email,
      product_id: product.id || product.uid,
      product_name: product.name,
      product_price: product.price,
      product_image: product.product_image || '',
      product_description: product.description,
      store_id: product.farmer_id,
      store_name: farmerDetails.store_name,
      store_address: farmerDetails.default_pickup_address,
      order_date: new Date(),
      quantity: quantityFromDetailsScreen, // Static quantity received from ProductDetailsScreen
      subtotal: subTotal,  
      delivery_fee: effectiveDeliveryFee, // Used the updated delivery fee after voucher discount
      total_amount: totalAmount,
      voucher_applied: voucher ? voucher.name : null, 
      voucher_discount: voucher ? voucher.discount_amount : 0,
      status: 'Processing', // Example status
    };

    try {
      // Add the order to Firestore
      await setDoc(doc(db, 'orders', orderId), order);
      Alert.alert('Success', 'Your order has been placed');

      const orderForNavigation = {
        ...order,
        order_id: orderId,
        order_date: new Date().toISOString()
      };

      navigation.navigate('BuyerOrderDetails', { order: orderForNavigation }); // Navigate to home or another page after successful order

    } catch (error) {
      console.error('Error placing order: ', error);
      Alert.alert('Error', 'There was an error placing your order. Please try again.');
    }
    
  };

  return (
    <LinearGradient colors={['#7A9F59', '#fff']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Check Out Order</Text>
      </View>

      {/* Scrollable content for Product Details */}
      <ScrollView style={styles.content}>
        <View style={styles.productCard}>
          {/* Image or Placeholder */}
          <View style={styles.imageContainer}>
            {product.product_image ? (
              <Image source={{ uri: product.product_image }} style={styles.productImage} />
            ) : (
              <Ionicons name="image-outline" size={100} color="#888" />
            )}
          </View>

          {/* Product Name and Price */}
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>₱ {product.price}</Text>

          {/* Product Description */}
          <Text style={styles.productDescription}>
            {product.description || "No description available"}
          </Text>

          {/* Product Stock */}
          <Text style={styles.productStock}>Stock: {product.stock}</Text>

          {/* Static Quantity */}
          <Text style={styles.quantityText}>Quantity: {quantityFromDetailsScreen}</Text>

          {/* Subtotal Display */}
          <Text style={styles.subtotalText}>Subtotal: ₱ {subTotal.toFixed(2)}</Text>

          {/* Voucher Button */}
          <TouchableOpacity style={styles.voucherButton} onPress={handleVoucherFetch}>
            <Text style={styles.voucherText}>View Vouchers</Text>
          </TouchableOpacity>

          {/* Applied Voucher Information */}
          {voucher && (
            <Text style={styles.voucherText}>
              Applied Voucher: {voucher.name} - {voucher.discount_type === 'delivery' ? '₱' + voucher.discount_amount : voucher.discount_amount + '%'}
            </Text>
          )}
          
          {/* Delivery Fee */}
          <Text style={styles.deliveryFeeText}>Delivery Fee: ₱ {adjustedDeliveryFee.toFixed(2)}</Text>

          {/* Total Amount */}
          <Text style={styles.totalAmountText}>Total Amount: ₱ {(subTotal + adjustedDeliveryFee).toFixed(2)}</Text>

          {/* Checkout Button */}
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleCheckout}
          >
            <Text style={styles.addToCartText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Available Vouchers</Text>
            {vouchers.length > 0 ? (
              vouchers.map((voucher) => (
                <TouchableOpacity key={voucher.id} style={styles.voucherItem} onPress={() => handleVoucherApply(voucher)}>
                  <Text style={styles.voucherItemText}>{voucher.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No vouchers available.</Text>
            )}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

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
  content: {
    marginTop: 10,
  },
  productCard: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
  },
  imageContainer: {
    alignItems: 'center',
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  productPrice: {
    fontSize: 18,
    color: '#7A9F59',
  },
  productDescription: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    color: '#666',
  },
  productStock: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  quantityText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  voucherButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#7A9F59',
    borderRadius: 5,
    alignItems: 'center',
  },
  voucherText: {
    color: '#fff',
  },
  deliveryFeeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
  },
  addToCartButton: {
    backgroundColor: '#7A9F59',
    borderRadius: 5,
    padding: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  voucherItem: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  voucherItemText: {
    fontSize: 16,
  },
  closeModalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#7A9F59',
    borderRadius: 5,
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default ProductScreen;
