import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomCheckbox = ({ value, onValueChange }) => (
  <TouchableOpacity
    style={[styles.checkbox, value ? styles.checked : styles.unchecked]}
    onPress={() => onValueChange(!value)}
    activeOpacity={0.8}
  >
    {value && <Icon name="check" size={14} color="#fff" />}
  </TouchableOpacity>
);

const SelectProScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [autoRenew, setAutoRenew] = useState(false);

  const handleSubscribe = () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a plan before subscribing.');
      return;
    }
    Alert.alert('Success', `You have subscribed to the ${selectedPlan} plan.`);
    navigation.navigate('ActivePro'); // Navigate to ActiveProScreen
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review your plan</Text>
      </View>

      {/* Plan Selection Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Choose your plan</Text>

        <View
          style={[
            styles.planCard,
            selectedPlan === '1 month' && styles.selectedPlan,
          ]}
        >
          <TouchableOpacity
            onPress={() => setSelectedPlan('1 month')}
            style={styles.planRow}
          >
            <Icon
              name={selectedPlan === '1 month' ? 'dot-circle-o' : 'circle-o'}
              size={20}
              color="#4CAF50"
            />
            <View style={styles.planDetails}>
              <Text style={styles.planTitle}>1 month (₱ 25.00 / month)</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.planCard,
            selectedPlan === '6 months' && styles.selectedPlan,
          ]}
        >
          <TouchableOpacity
            onPress={() => setSelectedPlan('6 months')}
            style={styles.planRow}
          >
            <Icon
              name={selectedPlan === '6 months' ? 'dot-circle-o' : 'circle-o'}
              size={20}
              color="#4CAF50"
            />
            <View style={styles.planDetails}>
              <Text style={styles.planTitle}>6 months (₱ 20.00 / month)</Text>
              <Text style={styles.planSubtext}>
                ₱ 120.00 billed every 6 months
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.planCard,
            selectedPlan === '12 months' && styles.selectedPlan,
          ]}
        >
          <TouchableOpacity
            onPress={() => setSelectedPlan('12 months')}
            style={styles.planRow}
          >
            <Icon
              name={selectedPlan === '12 months' ? 'dot-circle-o' : 'circle-o'}
              size={20}
              color="#4CAF50"
            />
            <View style={styles.planDetails}>
              <Text style={styles.planTitle}>12 months (₱ 15.00 / month)</Text>
              <Text style={styles.planSubtext}>
                ₱ 180.00 billed every 12 months
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Method Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentCard}>
          <Icon name="credit-card" size={20} color="#4CAF50" />
          <Text style={styles.paymentText}>GCash (Alipay + Partner)</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SelectPayment')}
          >
            <Icon name="pencil" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        <View style={styles.autoRenewContainer}>
          <CustomCheckbox value={autoRenew} onValueChange={setAutoRenew} />
          <Text style={styles.autoRenewText}>
            Subscription automatically renews according to your plan
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Text style={styles.totalText}>Total (incl. fees and tax)</Text>
        <Text style={styles.totalAmount}>
          ₱{' '}
          {selectedPlan === '1 month'
            ? '25.00'
            : selectedPlan === '6 months'
            ? '120.00'
            : selectedPlan === '12 months'
            ? '180.00'
            : '0.00'}
        </Text>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
          activeOpacity={0.8}
        >
          <Text style={styles.subscribeText}>Confirm and subscribe</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e3f2fd',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#37474f',
  },
  planCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedPlan: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9',
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  planDetails: {
    marginLeft: 10,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  planSubtext: {
    fontSize: 12,
    color: '#666',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  paymentText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    color: '#37474f',
  },
  autoRenewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  autoRenewText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#4CAF50',
  },
  unchecked: {
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#bbb',
  },
  footerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#37474f',
  },
  subscribeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectProScreen;