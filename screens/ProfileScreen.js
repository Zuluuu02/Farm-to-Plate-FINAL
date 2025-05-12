import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { collection, doc, getDocs, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; 

const ProfileScreen = ({ navigation }) => {
  
  const { setIsFirstLaunch, userData } = useContext(AuthContext);
  
  const [avatar, setAvatar] = useState('https://via.placeholder.com/150'); 
  const [approvalStatus, setApprovalStatus] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        const farmerCollectionRef = collection(db, 'users', userData.uid, 'farmer_details');
        const q = query(farmerCollectionRef, where("email", "==", userData.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const data = docSnap.data();
          setApprovalStatus(data.approval_status || null);

        } else {
          setApprovalStatus(null); // Farmer details do not exist
        }
        console.log(approvalStatus);

      } catch (error) {
        console.error('Error fetching farmer details:', error.message);

      } finally {
        setIsLoading(false); 
      }
    };

    const fetchAvatar = async () => {
      try {
        // Fetch user document to get avatar URL
        const userDocRef = doc(db, 'users', userData.uid);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const userDataFromDb = userDoc.data();
          const avatarPath = userDataFromDb.avatar || 'https://via.placeholder.com/150';
          setAvatar(avatarPath);
        }
      } catch (error) {
        console.error('Error fetching avatar:', error.message);
        setAvatar('https://via.placeholder.com/150'); // Fallback avatar
      }
    };

    fetchFarmerDetails();
    fetchAvatar();
  }, [userData.uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsFirstLaunch(false);
      
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Media access is required to upload an image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) { 
      const uri = result.assets[0].uri;
      console.log(uri);
      const filename = uri.split('/').pop();
      console.log(filename);
      const timestamp = new Date().toISOString();
      console.log(timestamp);
      const fileExtension = filename.split('.').pop();
      console.log(fileExtension);
      const newFilename = `avatar_${timestamp}.${fileExtension}`; 
      console.log(newFilename);

      // Save the image to the assets folder (in a local subdirectory)
      const assetPath = FileSystem.documentDirectory + 'assets/' + newFilename;
      console.log(assetPath);
      try {
        await FileSystem.copyAsync({
          from: uri,
          to: assetPath,
        });

        console.log(' im here')
        
        setAvatar(assetPath);

        const userDocRef = doc(db, 'users', userData.uid);
        await updateDoc(userDocRef, {
          avatar: assetPath,
        });

        console.log("Avatar updated in state:", assetPath);
  
      } catch (error) {
        console.error('Error uploading image: ', error.message);
        Alert.alert("An error occurred while uploading the image.");
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E4C2D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#2E4C2D', '#2E4C2D']} style={styles.header}>
        <Text style={styles.title}>Account</Text>
      </LinearGradient>
  
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleImageUpload}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text style={styles.uploadText}>Tap to upload</Text>
          </TouchableOpacity>
          <Text style={styles.userName}>
            {(userData.first_name && userData.last_name) 
              ? `${userData.first_name} ${userData.last_name}` 
              : userData.email}
          </Text>
  
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('InfoProfile')}
          >
            <Icon name="edit" size={16} color="#fff" style={styles.actionIcon} />
            <Text style={styles.editProfile}>Edit Profile</Text>
          </TouchableOpacity>
  
          {approvalStatus !== 'approved' && (
            <TouchableOpacity
              style={styles.farmerRegisterButton}
              onPress={() => navigation.navigate('Shop')}
            >
              <Icon name="leaf" size={16} color="#fff" style={styles.actionIcon} />
              <Text style={styles.farmerRegisterText}>Register as a Farmer</Text>
            </TouchableOpacity>
          )}
  
          {userData.role === 'farmer' && approvalStatus === 'approved' && (
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('ShopDashboard')}
            >
              <FontAwesome5 name="store" size={16} color="#fff" style={styles.actionIcon} />
              <Text style={styles.shopButtonText}>Go to Shop Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>
  
        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('BuyerOrderList')}
          >
            <Icon name="list-alt" size={30} color="#2E4C2D" />
            <Text style={styles.actionText}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Favourites')}
          >
            <Icon name="heart" size={30} color="#2E4C2D" />
            <Text style={styles.actionText}>Favourites</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Addresses')}
          >
            <Icon name="address-book" size={30} color="#2E4C2D" />
            <Text style={styles.actionText}>Addresses</Text>
          </TouchableOpacity>
        </View>
  
        {/* Additional Sections */}
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate('Pro')}
        >
          <View style={styles.listItemContent}>
            <FontAwesome5 name="crown" size={20} color="#FFD700" style={styles.listItemIcon} />
            <Text style={styles.listItemText}>Become a Pro</Text>
          </View>
          <Icon name="angle-right" size={20} color="#4CAF50" />
        </TouchableOpacity>
  
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate('HelpCenter')}
        >
          <View style={styles.listItemContent}>
            <Icon name="question-circle" size={20} color="#2E4C2D" style={styles.listItemIcon} />
            <Text style={styles.listItemText}>Help Center</Text>
          </View>
          <Icon name="angle-right" size={20} color="#4CAF50" />
        </TouchableOpacity>
  
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate('TermsAndPolicies')}
        >
          <View style={styles.listItemContent}>
            <Icon name="file-text" size={20} color="#2E4C2D" style={styles.listItemIcon} />
            <Text style={styles.listItemText}>Terms & Policies</Text>
          </View>
          <Icon name="angle-right" size={20} color="#4CAF50" />
        </TouchableOpacity>
  
        {/* Log Out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() =>
            Alert.alert('Log Out', 'Are you sure you want to log out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log Out', style: 'destructive', onPress: () => handleLogout() },
            ])
          }
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C8D6C5',
  },
  container: {
    flex: 1,
    backgroundColor: '#C8D6C5',
  },
  header: {
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    position: 'relative',
  },
  gearButton: {
    position: 'absolute',
    right: 20,
    top: 25,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 5,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#2E4C2D',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 5,
  },
  editProfile: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  farmerRegisterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#4CAF50', // Green theme for farmer registration
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 5,
  },
  farmerRegisterText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#4CAF50', // Green theme
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 5,
  },
  shopButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  actionText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginVertical: 8,
    elevation: 2,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemIcon: {
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#E63946',
    padding: 15,
    margin: 20,
    marginBottom: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;