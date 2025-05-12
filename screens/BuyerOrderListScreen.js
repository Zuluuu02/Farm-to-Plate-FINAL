import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { AuthContext } from '../providers/AuthProvider';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const BuyerOrderListScreen = ({ navigation }) => {
  const { userAuthData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('All Orders');
  const [orders, setOrders] = useState({
    'All Orders': [],
    Pending: [],
    Processing: [],
    Completed: [],
    Cancelled: [],
  });

  useEffect(() => {
    if (!userAuthData?.uid) return;

    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef, where('user_id', '==', userAuthData.uid));

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const fetchedOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const categorizedOrders = {
        'All Orders': fetchedOrders,
        Pending: fetchedOrders.filter(order => order.status === 'Pending'),
        Processing: fetchedOrders.filter(order => order.status === 'Processing'),
        Completed: fetchedOrders.filter(order => order.status === 'Completed'),
        Cancelled: fetchedOrders.filter(order => order.status === 'Cancelled'),
      };

      setOrders(categorizedOrders);
    });

    return () => unsubscribe();
  }, [userAuthData]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Orders"
          placeholderTextColor="#888"
        />
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
      >
        {['All Orders', 'Pending', 'Processing', 'Completed', 'Cancelled'].map((status, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tabButton, activeTab === status && styles.activeTab]}
            onPress={() => setActiveTab(status)}
          >
            <Text style={activeTab === status ? styles.tabTextActive : styles.tabText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Order List */}
      <ScrollView style={styles.orderList}>
        {orders[activeTab].map((order) => (
          <View style={styles.orderCard} key={order.id}>
            <View style={styles.orderDetails}>
              <Text style={styles.orderTitle}>Order for {order.product_name}</Text>
              <Text style={styles.orderInfo}>Price: ₱{order.product_price}</Text>
              <Text style={styles.orderInfo}>Quantity: {order.quantity}</Text>
              <Text style={styles.orderPrice}>₱{order.total_amount}</Text>
            </View>
            <View style={styles.orderActions}>
              <Text style={[styles.orderStatus, styles[order.status.toLowerCase()]]}>
                {order.status}
              </Text>
              <TouchableOpacity
                style={styles.viewOrderButton}
                onPress={() => navigation.navigate('BuyerOrderDetails', { order: order })}
              >
                <Text style={styles.viewOrderText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  tabContainer: {
    marginBottom: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tabButton: {
    height: 30,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
    marginRight: 8,
    elevation: 1,
  },
  activeTab: {
    backgroundColor: '#2E4C2D',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  tabTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  orderList: {
    paddingHorizontal: 20,
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  orderDetails: {
    flex: 1,
    marginRight: 10,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  orderInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E4C2D',
  },
  orderActions: {
    alignItems: 'flex-end',
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  pending: { color: '#FFA500' },
  processing: { color: '#007BFF' },
  completed: { color: '#28A745' },
  cancelled: { color: '#DC3545' },
  viewOrderButton: {
    backgroundColor: '#2E4C2D',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  viewOrderText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BuyerOrderListScreen;
