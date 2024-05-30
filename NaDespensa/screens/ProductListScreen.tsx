import React, { useEffect, useState, useCallback  } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import dayjs from 'dayjs';
import { useFocusEffect } from '@react-navigation/native';

const ProductListScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [products, setProducts] = useState(route.params.products || []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://192.168.100.106:3000/users/${userId}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleEditProduct = (product) => {
    navigation.navigate('EditProduct', { product });
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert(
      "Confirmação",
      "Você tem certeza que deseja excluir este produto?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.100.106:3000/products/${productId}`);
              setProducts(products.filter((product) => product.id !== productId));
            } catch (error) {
              console.error(error);
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const getItemStyle = (expiryDate) => {
    const today = dayjs();
    const expiry = dayjs(expiryDate);
    const diffDays = expiry.diff(today, 'day');

    if (diffDays < 0) {
      return styles.expiredItem;
    } else if (diffDays <= 5) {
      return styles.warningItem;
    } else {
      return styles.item;
    }
  };

  const renderItem = ({ item }) => (
    <View style={getItemStyle(item.expiry_date)}>
      <Text>Nome: {item.name}</Text>
      <Text>Quantidade: {item.quantity}</Text>
      <Text>Data de Validade: {dayjs(item.expiry_date).format('DD/MM/YYYY')}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Editar" onPress={() => handleEditProduct(item)} />
        <Button title="Excluir" onPress={() => handleDeleteProduct(item.id)} color="red" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct', { userId })}
      >
        <Text style={styles.addButtonText}>Adicionar Produto</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.recipesButton}
        onPress={() => navigation.navigate('Recipes', { userId })}
      >
        <Text style={styles.recipesButtonText}>Ver Receitas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  warningItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f7ff66',
  },
  expiredItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f06451',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  recipesButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  recipesButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProductListScreen;
