import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // For the crown icon

const ActiveProScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Welcome to PlatePro</Text>
      </View>

      {/* Subscription Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Your PlatePro subscription is <Text style={styles.activeText}>active</Text>!
        </Text>
      </View>

      {/* Subscription Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Subscription Name: PlatePro Membership</Text>
        <Text style={styles.detailText}>Activation Date: 12/12/24</Text>
        <Text style={styles.detailText}>Renewal Date: 01/12/25</Text>
        <Text style={styles.detailText}>Current Benefits:</Text>
        <Text style={styles.benefitText}>- Exclusive Discounts</Text>
        <Text style={styles.benefitText}>- Priority Customer Support</Text>
        <Text style={styles.detailText}>Payment Method: GCash</Text>
        <Text style={styles.detailText}>Billing Cycle: Monthly</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeText}>Upgrade Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel Subscription</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statusContainer: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  activeText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  benefitText: {
    fontSize: 14,
    color: '#777',
    marginLeft: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upgradeButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E53935',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ActiveProScreen;
