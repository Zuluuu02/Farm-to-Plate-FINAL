import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
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
import { ftpContext } from './ftpQuestions';
import { GROQ_API_KEY, GROQ_API_URL, GROQ_MODEL } from './groqConfig';

export default function VirtualAssistantScreen() {
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi! How can I help you today?', sender: 'assistant' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

 const generateReply = async (userInput) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for the Plateful app. Use the following context to answer questions:\n\n${ftpContext}`
          },
          { role: 'user', content: userInput }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq error:', error.message);
    return "Sorry, I'm having trouble right now. Please try again later.";
  }
}; const handleSend = async () => {
    if (!input.trim()) return;

    Keyboard.dismiss();
    setLoading(true);

    const timestamp = Date.now().toString();
    const userMessage = { id: timestamp, text: input, sender: 'user' };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const reply = await generateReply(input);
    const assistantMessage = {
      id: (parseInt(timestamp) + 1).toString(),
      text: reply,
      sender: 'assistant'
    };

    setMessages(prev => [...prev, assistantMessage]);
    setLoading(false);
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
            editable={!loading}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={loading}>
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
