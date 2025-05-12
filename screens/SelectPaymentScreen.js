import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SelectPaymentScreen = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    { id: 1, name: 'GCash (Alipay + Partner)', number: null },
    { id: 2, name: 'GCash (Alipay + Partner)', number: '63-9****85436' },
  ];

  const handleConfirm = () => {
    if (!selectedMethod) {
      alert('Please select a payment method.');
      return;
    }
    navigation.navigate('ActivePro'); // Navigate to ActiveProScreen
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.paymentRow,
        selectedMethod === item.id && styles.selectedPaymentRow,
      ]}
      onPress={() => setSelectedMethod(item.id)}
    >
      <Image
        source={{ uri: 'https://seeklogo.com/images/G/gcash-logo-5A30C4A7E5-seeklogo.com.png' }}
        style={styles.logo}
      />
      <View style={styles.textContainer}>
        <Text style={styles.paymentName}>{item.name}</Text>
        {item.number && <Text style={styles.paymentNumber}>{item.number}</Text>}
      </View>
      <Icon
        name={selectedMethod === item.id ? 'dot-circle-o' : 'circle-o'}
        size={20}
        color={selectedMethod === item.id ? '#4CAF50' : '#555'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select a Payment Method</Text>
      </View>

      {/* Payment Options */}
      <FlatList
        data={paymentMethods}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {/* Confirm Payment Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmText}>Confirm Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 1,
  },
  selectedPaymentRow: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentNumber: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SelectPaymentScreen;
