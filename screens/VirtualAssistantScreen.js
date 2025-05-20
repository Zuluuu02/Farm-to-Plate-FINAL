import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Fuse from 'fuse.js';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// --- FAQ Data ---
const faqData = [
  { question: 'how do i place an order', answer: 'Browse products, add items to your cart, and proceed to checkout...' },
  { question: 'what is platepro', answer: 'PlatePro is our premium membership with perks like free delivery and discounts.' },
  { question: 'how do i list my products', answer: 'Log in to your farmer account and upload your product details.' },
  { question: 'how do i manage orders', answer: 'Manage orders in the "Orders" section of your dashboard.' },
  { question: "what happens if i can't fulfill an order", answer: 'Contact support immediately and we’ll assist in resolving it.' },
  { question: 'how do i track my order', answer: 'Track your order from the "My Orders" section in your profile.' },
  { question: 'can i cancel my order', answer: 'Orders can be canceled before processing from "My Orders".' },
  { question: 'what if there’s an issue with my delivery', answer: 'Contact support via chat or the Help section.' },
  { question: 'how do i subscribe to platepro', answer: 'Go to Profile > “Become a Pro”, choose a plan, and subscribe.' },
  { question: 'how do i use my perks', answer: 'Perks apply automatically during checkout.' },
  { question: 'can i cancel my subscription', answer: 'Yes, cancel anytime in “PlatePro” settings. Benefits stay active until billing ends.' },
  { question: 'what payment methods do you accept', answer: 'We accept e-wallets and Cash on Delivery (COD).' },
  { question: 'how do i request a refund', answer: 'Submit a request with order details. Refunds process in 7–10 business days.' },
  { question: 'i forgot my password. how do i reset it', answer: 'Tap “Forgot Password”, enter your email, and follow the steps.' },
  { question: 'why can’t i log in', answer: 'Check your credentials and network. Still stuck? Contact support.' },
  { question: 'what should i do if the app crashes', answer: 'Update to the latest version or report via "Bug Report" section.' },
];

// --- Fuse.js Setup ---
const fuse = new Fuse(faqData, {
  keys: ['question'],
  threshold: 0.4,
});

export default function VirtualAssistantScreen() {
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi! How can I help you today?', sender: 'assistant' }
  ]);
  const [input, setInput] = useState('');
  const [lastSuggestedFAQ, setLastSuggestedFAQ] = useState(null);

  const generateReply = (userInput) => {
    const input = userInput.trim().toLowerCase();

    // Handle confirmation response
    if (lastSuggestedFAQ) {
      if (['yes', 'yep', 'yeah', 'correct'].includes(input)) {
        const reply = lastSuggestedFAQ.answer;
        setLastSuggestedFAQ(null);
        return `${reply} 😊 Anything else you'd like to ask?`;
      } else if (['no', 'nope', 'nah'].includes(input)) {
        setLastSuggestedFAQ(null);
        return `Okay, no problem! You can rephrase your question or ask about something else. 😊`;
      }
    }

    // Standard Fuse.js search
    const results = fuse.search(input);

    if (results.length > 0) {
      const { question, answer } = results[0].item;
      setLastSuggestedFAQ(results[0].item);
      return `Answer: ${answer} 😊\n\nDid you mean: "${question}"?`;
    }

    return "I'm sorry, I couldn't find an answer to that. Please contact our support team for help. 😊";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    Keyboard.dismiss();

    const timestamp = Date.now().toString();
    const userMessage = { id: timestamp, text: input, sender: 'user' };
    const assistantMessage = {
      id: (parseInt(timestamp) + 1).toString(),
      text: generateReply(input),
      sender: 'assistant'
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Virtual Assistant</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
        />

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  backButton: {
    marginRight: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff'
  },
  messageList: {
    padding: 12
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
    maxWidth: '80%'
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end'
  },
  assistantMessage: {
    backgroundColor: '#eaeaea',
    alignSelf: 'flex-start'
  },
  messageText: {
    fontSize: 15
  },
  inputSection: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopColor: '#ccc',
    borderTopWidth: 1
  },
  input: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 15
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
