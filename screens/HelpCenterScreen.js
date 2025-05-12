import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HelpCenterScreen = ({ navigation }) => {

  const [expandedSections, setExpandedSections] = useState([]); // Initialize as an empty array

  const toggleSection = (index) => {
    // Toggle logic for FAQ expansion
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter((i) => i !== index));
    } else {
      setExpandedSections([...expandedSections, index]);
    }
  };

  const faqData = [
    {
      question: 'How do I place an order?',
      answer:
        'Browse products, add items to your cart, and proceed to checkout. Select your delivery address and payment method to confirm your order.',
    },
    {
      question: 'What is PlatePro?',
      answer:
        'PlatePro is our premium membership offering exclusive perks like free delivery, discounts, and surprise benefits. Learn more in the Membership section.',
    },
    {
      question: 'How do I list my products?',
      answer:
        'Log in to your farmer account, go to "My Products," and upload details, including photos, pricing, and quantity.',
    },
    {
      question: 'How do I manage orders?',
      answer:
        'Check the "Orders" section in your dashboard to view, confirm, and update the status of orders.',
    },
    {
      question: "What happens if I can't fulfill an order?",
      answer:
        'Notify us immediately through the Contact Support option, and we will assist in resolving the issue with the consumer.',
    },
    {
      question: 'How do I track my order?',
      answer:
        'Go to "My Orders" in your account to view the status and estimated delivery time of your order.',
    },
    {
      question: 'Can I cancel my order?',
      answer:
        'Orders can be canceled before they are processed. Go to "My Orders" and select "Cancel" for eligible orders.',
    },
    {
      question: 'What if there’s an issue with my delivery?',
      answer:
        'If there’s a delay or problem, contact our support team through the Help section or via chat.',
    },
    {
      question: 'How do I subscribe to PlatePro?',
      answer:
        'Go to Profile in the app and “Become a pro”. Choose your payment plan (monthly or annually) to activate.',
    },
    {
      question: 'How do I use my perks?',
      answer:
        'Perks like free delivery or discounts are automatically applied at checkout.',
    },
    {
      question: 'Can I cancel my subscription?',
      answer:
        'Yes, you can cancel anytime from the “PlatePro" section. Benefits will remain active until the billing cycle ends.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept e-wallets, and cash on delivery (COD).',
    },
    {
      question: 'How do I request a refund?',
      answer:
        'Contact our support team with your order details. Refunds will be processed within 7-10 business days, depending on the payment method.',
    },
    {
      question: 'I forgot my password. How do I reset it?',
      answer:
        'Click "Forgot Password" on the login page, enter your email, and follow the reset instructions.',
    },
    {
      question: 'Why can’t I log in?',
      answer:
        'Ensure your account details are correct, and your internet connection is stable. If the issue persists, contact support.',
    },
    {
      question: 'What should I do if the app crashes?',
      answer:
        'Update the app to the latest version. If the problem continues, report the issue through the "Report a Bug" option in the app.',
    },
    {
      question: 'Contact Us',
      answer:
        'Live Chat: Available in-app, 8:00 AM - 8:00 PM daily.\nEmail Support: Send your inquiries to support@farmtoplate.com.\nPhone Support: Call us at +63 123 456 7890 during business hours.',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.closeButton}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      <ScrollView style={styles.content}>
        {faqData.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity
              onPress={() => toggleSection(index)}
              style={styles.faqQuestionContainer}
            >
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Icon
                name={expandedSections.includes(index) ? 'angle-up' : 'angle-down'}
                size={20}
                color="black"
              />
            </TouchableOpacity>
            {expandedSections.includes(index) && (
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            )}
          </View>
        ))}
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
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 0, 
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    elevation: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#37474f',
  },
  faqAnswer: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default HelpCenterScreen;
