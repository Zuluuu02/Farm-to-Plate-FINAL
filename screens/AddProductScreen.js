import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { AuthContext } from '../providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; 

const AddProductScreen = ({ navigation, route }) => {

  const { userData } = useContext(AuthContext);
  const { product, isEdit } = route.params || {};

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [productImage, setProductImage] = useState('');

  useEffect(() => {
    if (isEdit) {
      setProductName(product.name);
      setCategory(product.category);
      setPrice(product.price);
      setStock(product.stock);
      setDescription(product.description);
      setProductImage(product.product_image);
    }
  }, [isEdit, product]);

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
      // Save the image to the product_images folder (in a local subdirectory)
      const assetPath = FileSystem.documentDirectory + 'product_images/' + newFilename;
      console.log(assetPath);
      
      try {
        await FileSystem.copyAsync({
          from: uri,
          to: assetPath,
        });

        console.log(' im here')
        
        setProductImage(assetPath);

        console.log("Product Image updated in state:", assetPath);
  
      } catch (error) {
        console.error('Error uploading image: ', error.message);
        Alert.alert("An error occurred while uploading the image.");
      }
    }
  };

  const handleSaveAndPublish = async () => {
    if (productImage && productName && category && price && stock && description) {

      try {
        if (isEdit) {
          const productRef = doc(db, 'products', product.id);
          await updateDoc(productRef, {
            name: productName,
            category: category,
            price: price,
            stock: stock,
            description: description,
            product_image: productImage,
          });
          Alert.alert('Success', 'Product updated successfully.');
          navigation.goBack();

        } else {
          const productRef = collection(db, 'products');  
          await addDoc(productRef, {
            name: productName,
            category: category,
            price,
            stock,
            description,
            product_image: productImage,  // Store local image filepath here
            farmer_id: userData.uid,
            discount_active: false,
            discount_price: 0,
            product_status: 'active',
            likes_count: 0,
            created_at: Date.now(),
          });
          console.log('Product saved successfully');
          Alert.alert('Success', 'Product added successfully!');
          navigation.push('ProductList'); 
        }

      } catch (error) {
        console.error('Error saving product: ', error);
        Alert.alert('Error', 'Failed to save the product.');
      }
    } else {
      Alert.alert('Missing Data', 'Please complete all fields before submitting.');
    }
  };

  const handleGoBack = () => {
    navigation.goBack(); // This navigates back to the previous screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
      </View>

      {/* Product Images Section */}
      <View style={styles.imageContainer}>
        <Text style={styles.sectionLabel}>Product Images</Text>
        <TouchableOpacity style={styles.imageUploadButton} onPress={handleImageUpload}>
          <Image
            source={{
              uri: productImage ? productImage : 'https://via.placeholder.com/100', 
            }}
            style={styles.image}
          />
          <Ionicons name="add" size={24} color="#2E4C2D" />
        </TouchableOpacity>
        <Text style={styles.addImageText}>+ Add Product Images</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Product Name</Text>
        <TextInput
          style={styles.input}
          value={productName}
          onChangeText={setProductName}
          placeholder="Product Name"
          maxLength={100}
        />
        <Text style={styles.charCount}>{productName.length}/100</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Price</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Price"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Input"
          maxLength={50}
        />
        <Text style={styles.charCount}>{category.length}/50</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Stock</Text>
        <TextInput
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          placeholder="Input"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Product Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Input"
          maxLength={300}
          multiline
        />
        <Text style={styles.charCount}>{description.length}/300</Text>
      </View>

      {/* Save and Publish Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndPublish}>
        <Text style={styles.saveButtonText}>Save and Publish</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  imageUploadButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#2E4C2D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F0F8F5',
  },
  image: {
    width: 60,
    height: 60,
    position: 'absolute',
  },
  addImageText: {
    fontSize: 14,
    color: '#2E4C2D',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#F9F9F9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#2E4C2D',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default AddProductScreen;
