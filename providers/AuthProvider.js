import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import{ auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

const AuthProvider = (props) => {
  // user null = loading  
  const [user, setUser] = useState(null);
  const [userAuthData, setUserAuthData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  const [shopSetupData, setShopSetupData] = useState({
    store_description: '',
    store_photo: null,
    store_name: '',
    default_pickup_address: {},
    email: '',
    phone: '',
    approval_status: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(true);
        setUserAuthData(u);
        fetchUserData(u.uid); // Fetch corresponding user data from Firestore
        
      } else {
        setUser(false);
        setUserAuthData(null);
        setUserData(null); // Clear user data if logged out
      }
    });
    return unsubscribe; // Cleanup on unmount
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid); 
      const docSnap = await getDoc(docRef); 

      if (docSnap.exists()) {
        setUserData(docSnap.data());  

      } else {
        console.log('No user document found, creating one.');
    
        await setDoc(docRef, {
          email: userAuthData.email,
          uid: userAuthData.uid
        });
  
        setUserData({
          email: userAuthData.email,
          uid: userAuthData.uid
        });
      }

    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userAuthData,
        userData,
        isFirstLaunch,
        shopSetupData,
        setUserData,
        setIsFirstLaunch,
        setShopSetupData,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };