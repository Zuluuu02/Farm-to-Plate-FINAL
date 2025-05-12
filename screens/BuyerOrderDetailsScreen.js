import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const BuyerOrderDetailsScreen = ({ route, navigation }) => {
  const { order } = route.params;  

  useEffect(() => {
    console.log('Order Details:', order);
  }, []);

  const [status, setStatus] = useState(order.status || 'Pending');
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelOrder = async () => {
    setIsLoading(true);
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, { status: 'Cancelled' });

      setStatus('Cancelled');
      Alert.alert('Order Cancelled', 'Your order status has been updated to Cancelled.');

      navigation.replace('BottomTabs'); 
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to cancel the order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProductImage = () => {
    if (order.product_image) {
      return (
        <Image
          source={{ uri: order.product_image }}
          style={styles.productImage}
          resizeMode="cover"
        />
      );
    }
    return (
      <Ionicons
        name="image-outline"
        size={50}
        color="#ccc"
        style={styles.productPlaceholder}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Order Details</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7A9F59" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {/* Order Summary */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.productRow}>
              {renderProductImage()}
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{order.product_name || '-'}</Text>
                <Text style={styles.detailText}>
                  <Text style={styles.label}>Quantity:</Text> {order.quantity || '0'}
                </Text>
              </View>
            </View>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Subtotal:</Text> ₱
              {isNaN(parseFloat(order.subtotal))
                ? '0.00'
                : parseFloat(order.subtotal).toFixed(2)}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Delivery Fee:</Text> ₱
              {isNaN(parseFloat(order.delivery_fee))
                ? '0.00'
                : parseFloat(order.delivery_fee).toFixed(2)}
            </Text>
            <Text style={styles.totalText}>
              <Text style={styles.label}>Total:</Text> ₱
              {isNaN(parseFloat(order.total_amount))
                ? '0.00'
                : parseFloat(order.total_amount).toFixed(2)}
            </Text>
            <Text style={styles.statusText}>Status: {status}</Text>
          </View>

          {/* Store Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Store Information</Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Store:</Text> {order.store_name || 'N/A'}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Address:</Text>{' '}
              {`${order.store_address.address_line_1}, ${order.store_address.barangay}, ${order.store_address.city}, ${order.store_address.zip_code}`}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Phone:</Text> {order.store_address.phone_number}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Contact Person:</Text> {order.store_address.name}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.backHomeButton}
              onPress={() => navigation.replace('BottomTabs')}
            >
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>

            {status !== 'Cancelled' && status !== 'Pending' && status !== 'Completed' && (
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
                <Text style={styles.buttonText}>Cancel Order</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7A9F59',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerText: { fontSize: 22, color: '#fff', marginLeft: 10, fontWeight: 'bold' },
  content: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  productRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
  },
  productPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: { flex: 1 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  detailText: { fontSize: 16, color: '#555', marginBottom: 8 },
  label: { fontWeight: '600', color: '#333' },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#7A9F59', marginTop: 10 },
  statusText: { fontSize: 16, fontWeight: 'bold', color: '#555', marginTop: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  backHomeButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
});

export default BuyerOrderDetailsScreen;
