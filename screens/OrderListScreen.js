import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../providers/AuthProvider';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const OrderListScreen = ({ navigation }) => {
  const { userAuthData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('All Orders');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [farmerDetails, setFarmerDetails] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        const farmerCollectionRef = collection(db, 'users', userAuthData?.uid, 'farmer_details');
        const q = query(farmerCollectionRef, where('email', '==', userAuthData?.email));
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

    fetchFarmerDetails();
  }, [userAuthData?.uid, userAuthData?.email]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, 'orders');
      const ordersQuery = query(ordersRef, where('store_id', '==', userAuthData?.uid));
      const querySnapshot = await getDocs(ordersQuery);

      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByTab = () => {
    if (activeTab === 'All Orders') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === activeTab));
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) =>
          order.product_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  };
  
  const handleDateSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      const dateA = a.order_date?.toDate();
      const dateB = b.order_date?.toDate();
      if (dateA && dateB) {
        return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    setFilteredOrders(sortedOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, [userAuthData?.uid]);
  
  useFocusEffect(
    useCallback(() => {
      fetchOrders();  
    }, [])
  );

  useEffect(() => {
    filterOrdersByTab();
  }, [activeTab, orders]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, orders]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Background Image for the Shop Cover */}
      <ImageBackground
        source={{ uri: farmerDetails.store_photo || 'https://via.placeholder.com/150' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Shop Header with Name */}
        <View style={styles.shopHeader}>
          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{farmerDetails.store_name}</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Order"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {['All Orders', 'Pending', 'Processing', 'Completed', 'Cancelled'].map((status, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tabButton, activeTab === status && styles.activeTab]}
            onPress={() => setActiveTab(status)}
          >
            <Text style={activeTab === status ? styles.tabTextActive : styles.tabText}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort Order (Date) */}
      <TouchableOpacity style={styles.sortContainer} onPress={handleDateSort}>
        <Text style={styles.sortText}>Sort by Date</Text>
        <Ionicons
          name={sortOrder === 'asc' ? 'arrow-down-circle' : 'arrow-up-circle'}
          size={24}
          color="#2E4C2D"
        />
      </TouchableOpacity>

      {/* Orders List */}
      {loading ? (
        <ActivityIndicator size="large" color="#2E4C2D" />
      ) : filteredOrders.length > 0 ? (
        <View style={styles.orderList}>
          {filteredOrders.map((order) => (
            <View style={styles.orderCard} key={order.id}>
              <View style={styles.orderDetails}>
                <Text style={styles.orderTitle}>{order.product_name}</Text>
                <Text style={styles.orderDescription}>
                  Date: {order.order_date?.toDate().toLocaleDateString() || 'N/A'}
                </Text>
                <Text style={styles.orderDescription}>
                  Quantity: {order.quantity} | Subtotal: ₱{order.subtotal}
                </Text>
              </View>
              <View style={styles.orderActions}>
                <Text style={[styles.orderStatus, styles[order.status.toLowerCase()]]}>
                  {order.status}
                </Text>
                <TouchableOpacity
                  style={styles.viewOrderButtonDetails}
                  onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
                >
                  <Text style={styles.viewOrderText}>View Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noOrdersText}>No orders available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8F9FA', paddingBottom: 20 },
  backgroundImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    paddingTop: 40,
    paddingBottom: 20,
    position: 'relative', // To ensure positioning for shop name and back button
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  shopHeader: {
    flexDirection: 'column', // Ensure vertical alignment
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    marginTop: 20, // Reduced margin to give more room for the name
    paddingHorizontal: 10,
  },
  shopInfo: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center', // Centering the text
    marginTop: 0, // Adjusting the vertical spacing
  },
  shopName: {
    fontSize: 24, // Increase font size for better visibility
    fontWeight: 'bold',
    color: '#fff', // White text to stand out against darker backgrounds
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Adding shadow for better contrast
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
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
    alignSelf: 'center',
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#302f2f',
  },
  tabContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 15,
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
  tabText: {
    color: '#2E4C2D',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#2E4C2D',
    fontWeight: 'bold',
  },
  orderList: { paddingHorizontal: 20 },
  orderCard: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDetails: { flex: 1, marginRight: 10 },
  orderTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  orderDescription: { fontSize: 14, color: '#777', marginVertical: 5 },
  orderActions: { alignItems: 'flex-end' },
  orderStatus: { fontWeight: 'bold', marginBottom: 5 },
  pending: { color: '#FF9900' },
  processing: { color: '#0000FF' },
  completed: { color: '#4CAF50' },
  cancelled: { color: '#F44336' },
  viewOrderButtonDetails: {
    backgroundColor: '#2E4C2D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  viewOrderText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  noOrdersText: { textAlign: 'center', fontSize: 18, color: '#888' },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 5,

  },
  sortText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#2E4C2D',
  },
});

export default OrderListScreen;
