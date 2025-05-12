import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const TermsAndPoliciesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Policies</Text>
      </View>

      {/* Terms and Policies Content */}
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>Farm to Plate Terms and Policies</Text>
        <Text style={styles.description}>
          Welcome to Farm to Plate! These terms and policies govern your use of our services and platform. By accessing or using Farm to Plate, you agree to comply with these terms. Please read them carefully.
        </Text>

        <Text style={styles.sectionTitle}>General Terms</Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Purpose:</Text> Farm to Plate connects farmers with consumers, providing a platform for selling and buying fresh produce directly.
        </Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Eligibility:</Text> Users must be at least 18 years old or have parental consent to use our services.
        </Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Account Creation:</Text> Users must provide accurate and complete information when creating an account. Users are responsible for maintaining the confidentiality of their account details.
        </Text>

        <Text style={styles.sectionTitle}>Use of the Platform</Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Prohibited Activities:</Text> Users must not misuse the platform, engage in fraudulent transactions, or violate any applicable laws.
        </Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Content:</Text> Users may not upload harmful, misleading, or inappropriate content to the platform.
        </Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Service Availability:</Text> We strive to keep the platform available but do not guarantee uninterrupted access.
        </Text>

        <Text style={styles.sectionTitle}>Transactions and Payments</Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Orders:</Text> Consumers can browse and order available products. All sales are subject to availability.
        </Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Payments:</Text> Payments must be made via the payment methods provided. Prices include applicable taxes unless stated otherwise.
        </Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Refunds and Cancellations:</Text> Refund and cancellation policies will apply to specific transactions. Please review them when placing an order.
        </Text>

        <Text style={styles.sectionTitle}>PlatePro Membership</Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Subscription:</Text> PlatePro offers premium features, including discounts, free delivery, and surprise perks. Subscriptions are billed monthly or annually.
        </Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Cancellation:</Text> Users can cancel their PlatePro subscription at any time. Benefits remain active until the end of the billing cycle.
        </Text>
        <Text style={styles.listItem}>
          • <Text style={styles.bold}>Non-Refundable:</Text> PlatePro subscriptions are non-refundable once billed.
        </Text>

        {/* Add more sections following the same pattern */}

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.description}>
          If you have questions about these terms, contact us at support@farmtoplate.com.
        </Text>
        <Text style={styles.description}>
          Thank you for choosing Farm to Plate, where fresh, affordable food meets convenience!
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
  },
  header: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  closeButton: {
    position: 'absolute',
    left: 0, 
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#4CAF50',
  },
  listItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TermsAndPoliciesScreen;
