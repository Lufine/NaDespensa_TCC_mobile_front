import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import dayjs from 'dayjs';
import { useFocusEffect } from '@react-navigation/native';

const ProductListScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [products, setProducts] = useState(route.params.products || []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://192.168.24.17:3000/users-products/${userId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
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
    console.log(`Attempting to delete product with ID: ${productId}`);
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
              const response = await axios.delete(`http://192.168.24.17:3000/products/${productId}`);
              if (response.data.success) {
                // Remove o produto da lista
                setProducts(products.filter((product) => product.id !== productId));
              } else {
                Alert.alert('Erro', 'Não foi possível excluir o produto');
              }
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Erro', 'Não foi possível excluir o produto');
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
    <View style={[styles.itemContainer, getItemStyle(item.expiry_date)]}>
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
      ) : null}
      <Text>Nome: {item.name}</Text>
      <Text>Quantidade: {item.quantity !== undefined ? item.quantity : 'Não especificado'}</Text>
      <Text>Data de Validade: {item.expiry_date ? dayjs(item.expiry_date).format('DD/MM/YYYY') : 'Data não especificada'}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Editar" onPress={() => handleEditProduct(item)} />
        <Button title="Excluir" onPress={() => handleDeleteProduct(item.id)} color="red" />
      </View>
    </View>
  );
  
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
    <FlatList
    data={products}
    keyExtractor={(item) => item.product_id ? item.product_id.toString() : Math.random().toString()} // Use um valor único
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
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
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
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
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
  listContent: {
    paddingBottom: 20,
  }
});

export default ProductListScreen;
