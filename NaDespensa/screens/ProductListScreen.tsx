import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const ProductListScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [products, setProducts] = useState(route.params.products || []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://192.168.24.17:3000/users/${userId}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

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
              await axios.delete(`http://192.168.24.17:3000/products/${productId}`);
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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Nome: {item.name}</Text>
      <Text>Quantidade: {item.quantity}</Text>
      <Text>Data de Validade: {item.expiry_date.split('-').reverse().join('/')}</Text>
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
});

export default ProductListScreen;
