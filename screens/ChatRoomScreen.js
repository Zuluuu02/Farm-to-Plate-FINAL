import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  where,
  getDocs,
} from 'firebase/firestore';
import { AuthContext } from '../providers/AuthProvider';

const ChatRoomScreen = ({ route, navigation }) => {
  const { chatId, name } = route.params;
  const { userAuthData } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [senderRole, setSenderRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readyToRender, setReadyToRender] = useState(false);

  const currentUserId = userAuthData?.uid;

  useEffect(() => {
    const messagesRef = collection(db, 'chat_rooms', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    const getChatRoomDetails = async () => {
      const chatDocRef = doc(db, 'chat_rooms', chatId);
      const chatDoc = await getDoc(chatDocRef);
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        if (chatData.buyer_id === currentUserId) {
          setSenderRole('buyer');
          setSenderId(currentUserId);
        } else if (chatData.farmer_id === currentUserId) {
          setSenderRole('farmer');
          setSenderId(currentUserId);
        }
        setReadyToRender(true);
      }
    };

    getChatRoomDetails();

    return () => unsubscribe();
  }, [chatId, currentUserId]);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      const messagesRef = collection(db, 'chat_rooms', chatId, 'messages');
      try {
        const messagesQuery = query(
          messagesRef,
          where('isRead', '==', false),
          where('senderId', '!=', userAuthData.uid)
        );

        const querySnapshot = await getDocs(messagesQuery);
        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            isRead: true,
          });
        });
      } catch (error) {
        console.error('Error marking messages as Read', error);
      }
    };

    markMessagesAsRead();
  }, []);

  const sendMessage = async () => {
    if (message.trim() && senderId) {
      try {
        const newMessage = {
          text: message,
          createdAt: new Date(),
          senderId: currentUserId,
          isRead: false,
        };
        await addDoc(collection(db, 'chat_rooms', chatId, 'messages'), newMessage);

        const chatDocRef = doc(db, 'chat_rooms', chatId);
        await updateDoc(chatDocRef, {
          last_message: message,
          last_message_time: newMessage.createdAt,
        });

        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const formatTime = (createdAt) => {
    const now = new Date();
    const date = new Date(createdAt.seconds * 1000);
  
    const isSameDay = 
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    
    const isYesterday =
      date.getDate() === now.getDate() - 1 &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  
    if (isSameDay) {
      return `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
    } else if (isYesterday) {
      return `Yesterday at ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
    } else {
      return `${date.toLocaleDateString()} at ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={["#FFFFFF", "#FFFFFF"]} style={styles.gradientBackground}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.chatHeader}>{name}</Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedMessage(item)}
              style={[
                styles.messageContainer,
                item.senderId === senderId ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.senderId === senderId ? styles.myMessageText : styles.theirMessageText,
                ]}
              >
                {item.text}
              </Text>
              {selectedMessage?.id === item.id && (
                <Text style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
              )}
            </TouchableOpacity>
          )}
          inverted={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#6A994E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 5,
  },
  chatHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6A994E',
  },
  messageContainer: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 8,
    maxWidth: '75%',
    marginHorizontal: 15,
    elevation: 3,
  },
  myMessage: {
    backgroundColor: '#6A994E',
    alignSelf: 'flex-end',
    marginRight: 10,
    borderBottomRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: '#F2F2F2',
    alignSelf: 'flex-start',
    marginLeft: 10,
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#b8b6b6',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#6A994E',
    borderRadius: 25,
  },
});

export default ChatRoomScreen;
