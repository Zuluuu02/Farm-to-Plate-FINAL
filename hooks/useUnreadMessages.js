import { useState, useEffect, useContext } from 'react';
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot, or } from 'firebase/firestore';
import { AuthContext } from '../providers/AuthProvider';

const useUnreadMessages = () => {
  const { userAuthData } = useContext(AuthContext); 
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    const chatRoomsRef = collection(db, 'chat_rooms');

    const chatRoomQuery = query(
      chatRoomsRef,
      or(
        where('buyer_id', '==', userAuthData.uid),
        where('farmer_id', '==', userAuthData.uid)
      )
    );

    const unsubscribeChatRooms = onSnapshot(chatRoomQuery, (chatRoomsSnapshot) => {
      if (!chatRoomsSnapshot.empty) {
        const checkUnreadMessages = chatRoomsSnapshot.docs.map((chatRoomDoc) => {
          const messagesRef = collection(chatRoomDoc.ref, 'messages');

          // Query messages for unread ones not sent by the current user
          const messagesQuery = query(
            messagesRef,
            where('isRead', '==', false),
            where('senderId', '!=', userAuthData.uid)
          );

          // Use onSnapshot for real-time updates
          return new Promise((resolve) => {
            const unsubscribeMessages = onSnapshot(messagesQuery, (messagesSnapshot) => {
              if (!messagesSnapshot.empty) {
                console.log('Unread messages found in room:', chatRoomDoc.id);
                setHasUnreadMessages(true); // Set the state to true if unread messages are found
                resolve(true);
              } else {
                resolve(false);
              }
            });

            // Cleanup message snapshot for this room
            return unsubscribeMessages;
          });
        });

        // Check all chat rooms for unread messages
        Promise.all(checkUnreadMessages).then((results) => {
          if (!results.includes(true)) {
            setHasUnreadMessages(false); // No unread messages across all rooms
          }
        });
      } else {
        setHasUnreadMessages(false); // No chat rooms
      }
    }); 

    // Cleanup the chat room listener
    return () => unsubscribeChatRooms();
  }, [userAuthData]);

  return hasUnreadMessages;
};

export default useUnreadMessages;
