import React, { useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(1); // Toggle between two users

  const sendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { id: Math.random().toString(), text: inputMessage, user: currentUser }]);
      setInputMessage('');
      setCurrentUser(currentUser === 1 ? 2 : 1); // Switch users
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.user === 1 ? styles.user1 : styles.user2]}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjusts the view when the keyboard is visible
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Offset for iOS
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }} // Space for the input field
        style={styles.chatList}
        // Removed ListFooterComponent to avoid nesting issues
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#C8D6C5',
  },
  chatList: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  user1: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-start', // Align to the left
  },
  user2: {
    backgroundColor: '#cfe2ff',
    alignSelf: 'flex-end', // Align to the right
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
});