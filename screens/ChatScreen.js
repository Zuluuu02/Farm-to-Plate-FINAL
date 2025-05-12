import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, getDocs, or, and } from 'firebase/firestore';
import { AuthContext } from '../providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';

const ChatScreen = ({ navigation }) => {
  const { userAuthData, userData } = useContext(AuthContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userId = userAuthData?.uid;
        if (!userId) return;

        const chatRoomsRef = collection(db, 'chat_rooms');
        const chatRoomsQuery = query(chatRoomsRef, and(
          where("status", "==", "active"),
          or(
            where('buyer_id', '==', userId),
            where('farmer_id', '==', userId)
          )
        ));

        const unsubscribe = onSnapshot(chatRoomsQuery, async (querySnapshot) => {
          const fetchedChatRooms = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const chatData = doc.data();
            const chatId = doc.id;

            return {
              id: chatId,
              ...chatData,
              actingAs: chatData.buyer_id === userId ? 'Buyer' : 'Seller',
              lastMessage: chatData.last_message,
              lastMessageTime: chatData.last_message_time,
            };
          }));

          setChatRooms(fetchedChatRooms);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
        setLoading(false);
      }
    };

    fetchChats();
  }, [userAuthData?.uid, userData?.profile_image]);

  const formatTime = (time) => {
    if (!time) return '';
    const date = time.seconds ? new Date(time.seconds * 1000) : new Date(time);
    return `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
  };

  if (loading) {
    return (
      <LinearGradient colors={['#7A9F59', '#BAC8E0']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading chats...</Text>
      </LinearGradient>
    );
  }

  if (chatRooms.length === 0) {
    return (
      <LinearGradient colors={['#7A9F59', '#BAC8E0']} style={styles.noChatsContainer}>
        <Text style={styles.noChatsText}>No chats available</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#7A9F59', '#fff']} style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Chat Room</Text>
      </View>

      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatListContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('ChatRoom', {
              chatId: item.id,
              name: item.buyer_id === userAuthData.uid ? item.store_name : item.buyer_name,
            })}
          >
            <View style={styles.chatDetails}>
              <View style={styles.chatTextContainer}>
                <Text style={styles.chatName}>
                  {item.buyer_id === userAuthData.uid ? item.store_name : item.buyer_name}
                </Text>
                <Text style={styles.chatMessage}>
                  {item.last_message || 'No recent message'}
                </Text>
                {item.lastMessageTime && (
                  <Text style={styles.chatTime}>{formatTime(item.lastMessageTime)}</Text>
                )}
              </View>
            </View>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#7A9F59',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  chatListContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  chatItem: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    marginVertical: 8,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    paddingLeft: 15,
  },
  chatDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chatMessage: {
    fontSize: 14,
    color: '#555',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadBadge: {
    backgroundColor: '#FF7043',
    borderRadius: 15,
    padding: 5,
    minWidth: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default ChatScreen;
