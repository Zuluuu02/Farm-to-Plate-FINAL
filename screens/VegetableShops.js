import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const VegetableShops = () => {
  const shops = [
    { id: '1', name: 'Fresh Farm', location: 'Rosario St.', description: 'Fresh and organic vegetables.' },
    { id: '2', name: 'Veggie Delight', location: 'Corrales Ave.', description: 'Affordable local greens.' },
    { id: '3', name: 'Fruit Basket', location: 'Carmen Market', description: 'Wide variety of vegetables.' },
    { id: '4', name: 'Green Shop', location: 'Limketkai Center', description: 'Imported and local vegetables.' },
  ];

  return (
    <FlatList
      data={shops}
      renderItem={({ item }) => (
        <View style={styles.shopCard}>
          <Text style={styles.shopName}>{item.name}</Text>
          <Text style={styles.shopLocation}>{item.location}</Text>
          <Text style={styles.shopDescription}>{item.description}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  shopCard: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  shopName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  shopLocation: { fontSize: 14, color: '#666', marginBottom: 5 },
  shopDescription: { fontSize: 12, color: '#999' },
});

export default VegetableShops;
