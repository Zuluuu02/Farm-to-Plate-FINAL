import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const faqData = [
  { question: 'how do i place an order', answer: 'Browse products, add items to your cart, and proceed to checkout. Select your delivery address and payment method to confirm your order.' },
  { question: 'what is platepro', answer: 'PlatePro is our premium membership offering exclusive perks like free delivery, discounts, and surprise benefits. Learn more in the Membership section.' },
  { question: 'how do i list my products', answer: 'Log in to your farmer account, go to "My Products," and upload details, including photos, pricing, and quantity.' },
  { question: 'how do i manage orders', answer: 'Check the "Orders" section in your dashboard to view, confirm, and update the status of orders.' },
  { question: "what happens if i can't fulfill an order", answer: 'Notify us immediately through the Contact Support option, and we will assist in resolving the issue with the consumer.' },
  { question: 'how do i track my order', answer: 'Go to "My Orders" in your account to view the status and estimated delivery time of your order.' },
  { question: 'can i cancel my order', answer: 'Orders can be canceled before they are processed. Go to "My Orders" and select "Cancel" for eligible orders.' },
  { question: 'what if there’s an issue with my delivery', answer: 'If there’s a delay or problem, contact our support team through the Help section or via chat.' },
  { question: 'how do i subscribe to platepro', answer: 'Go to Profile in the app and “Become a pro”. Choose your payment plan (monthly or annually) to activate.' },
  { question: 'how do i use my perks', answer: 'Perks like free delivery or discounts are automatically applied at checkout.' },
  { question: 'can i cancel my subscription', answer: 'Yes, you can cancel anytime from the “PlatePro" section. Benefits will remain active until the billing cycle ends.' },
  { question: 'what payment methods do you accept', answer: 'We accept e-wallets, and cash on delivery (COD).' },
  { question: 'how do i request a refund', answer: 'Contact our support team with your order details. Refunds will be processed within 7-10 business days, depending on the payment method.' },
  { question: 'i forgot my password. how do i reset it', answer: 'Click "Forgot Password" on the login page, enter your email, and follow the reset instructions.' },
  { question: 'why can’t i log in', answer: 'Ensure your account details are correct, and your internet connection is stable. If the issue persists, contact support.' },
  { question: 'what should i do if the app crashes', answer: 'Update the app to the latest version. If the problem continues, report the issue through the "Report a Bug" option in the app.' },
];

export default function VirtualAssistantScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi! How can I help you today?', sender: 'assistant' }
  ]);
  const [input, setInput] = useState('');

  const getBotReply = (userInput) => {
    const normalizedInput = userInput.toLowerCase().trim();

    let bestMatch = null;
    let highestScore = 0;

    for (let faq of faqData) {
      const faqQuestion = faq.question.toLowerCase();
      const faqWords = faqQuestion.split(' ');
      const inputWords = normalizedInput.split(' ');

      const commonWords = inputWords.filter(word => faqWords.includes(word));
      const score = commonWords.length / faqWords.length;

      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq;
      }
    }

    if (highestScore >= 0.3 && bestMatch) {
      return `${bestMatch.answer} 😊 Is there anything else I can help you with?`;
    }

    return "Sorry, I couldn't find an answer for that. Please contact support. 😊";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    const botReply = getBotReply(input);

    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      text: botReply,
      sender: 'assistant'
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.assistantMessage
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <Text style={styles.header}>Virtual Assistant</Text>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: '#4CAF50',
    color: '#fff'
  },
  messageList: { padding: 10 },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%'
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end'
  },
  assistantMessage: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start'
  },
  messageText: { fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc'
  },
  input: { flex: 1, fontSize: 16, padding: 10, backgroundColor: '#eee', borderRadius: 20 },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 10
  }
});
