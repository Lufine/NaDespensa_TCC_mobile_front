import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const AddProductScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const { userId } = route.params;

  const handleAddProduct = async () => {
    if (!name || !quantity || !expiryDate) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    const formattedDate = expiryDate.split('/').reverse().join('-');

    try {
      await axios.post('http://192.168.24.17:3000/products', {
        name,
        quantity,
        expiry_date: formattedDate,
        user_id: userId,
      });

      const response = await axios.get(`http://192.168.24.17:3000/users/${userId}/products`);
      const updatedProducts = response.data;

      navigation.navigate('ProductList', { products: updatedProducts });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nome</Text>
      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Text>Quantidade</Text>
      <TextInput
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text>Data de Validade (DD/MM/YYYY)</Text>
      <TextInput
        placeholder="Data de Validade"
        value={expiryDate}
        onChangeText={setExpiryDate}
        style={styles.input}
      />
      <Button title="Adicionar Produto" onPress={handleAddProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default AddProductScreen;
