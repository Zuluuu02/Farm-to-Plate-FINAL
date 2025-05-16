import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';
import { AuthContext } from '../providers/AuthProvider';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params; // Receive the orderId from navigation
  const { userAuthData } = useContext(AuthContext);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderRef = doc(db, 'orders', orderId);
        const orderSnapshot = await getDoc(orderRef);

        if (orderSnapshot.exists()) {
          setOrderDetails(orderSnapshot.data());
        } else {
          console.log("No such order!");
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const updateOrderStatus = async (newStatus) => {
    try {
      setLoading(true);
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      Alert.alert(`Order status updated to: ${newStatus}`);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating order status: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2E4C2D" style={styles.loading} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      {/* Order Info */}
      <View style={styles.orderInfo}>
        <Image
            source={{
            uri: orderDetails?.product_image || 'https://via.placeholder.com/150'
            }}
            style={styles.productImage}
        />
        <View style={styles.orderTextContainer}>
          <Text style={styles.productName}>{orderDetails?.product_name}</Text>
          <Text style={styles.orderDate}>
            Ordered on: {orderDetails?.order_date?.toDate().toLocaleDateString() || 'N/A'}
          </Text>
          <Text style={styles.orderQuantity}>
            Quantity: {orderDetails?.quantity} | Subtotal: ₱{orderDetails?.subtotal}
          </Text>
          <Text style={styles.customerName}>Customer: {orderDetails?.user_name}</Text>
        </View>
      </View>

       {/* Order Status */}
      <View style={styles.orderStatusContainer}>
        <Text style={styles.statusTitle}>Order Status: </Text>
        <Text style={[styles.statusText, statusStyle]}>
          {orderDetails?.status || 'Pending'}
        </Text>
      </View>

      {/* Order Actions */}
      <View style={styles.actionsContainer}>
        {orderDetails?.status === 'Pending' && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => updateOrderStatus('Completed')}  // Mark as Completed
          >
            <Text style={styles.actionButtonText}>Mark as Completed</Text>
          </TouchableOpacity>
        )}
        {orderDetails?.status === 'Processing' && (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={() => updateOrderStatus('Cancelled')}  // Cancel Order
            >
              <Text style={styles.actionButtonText}>Cancel Order</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.pendingButton]} 
              onPress={() => updateOrderStatus('Pending')}  // Cancel Order
            >
              <Text style={styles.actionButtonText}>Accept Order</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8F9FA', paddingBottom: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2E4C2D',
    elevation: 3,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  orderInfo: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFF',
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  productImage: { width: 100, height: 100, borderRadius: 10, marginRight: 15 },
  orderTextContainer: { flex: 1 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  orderDate: { fontSize: 14, color: '#777' },
  orderQuantity: { fontSize: 14, marginVertical: 5, color: '#777' },
  customerName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  orderStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  statusTitle: { fontSize: 18, },
  statusText: { fontSize: 18, fontWeight: 'bold' },
  pending: { color: '#FFA500' },
  processing: { color: '#007BFF' },
  completed: { color: '#28A745' },
  cancelled: { color: '#DC3545' },
  actionsContainer: { paddingHorizontal: 20 },
  actionButton: {
    backgroundColor: '#28A745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  cancelButton: { backgroundColor: '#DC3545' },
  pendingButton: { backgroundColor: 'orange' },
  actionButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  loading: { marginTop: 20 },
});

export default OrderDetailsScreen;
