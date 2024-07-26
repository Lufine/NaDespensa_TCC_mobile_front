import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { format, parse, isValid } from 'date-fns';

const EditProductScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [name, setName] = useState(product.name);
  const [quantity, setQuantity] = useState(product.quantity.toString());
  const [expiryDate, setExpiryDate] = useState(product.expiry_date.split('-').reverse().join('/'));

  const validateDate = (date) => {
    const parsedDate1 = parse(date, 'dd-MM-yyyy', new Date());
    const parsedDate2 = parse(date, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate1)) {
      return format(parsedDate1, 'yyyy-MM-dd');
    } else if (isValid(parsedDate2)) {
      return format(parsedDate2, 'yyyy-MM-dd');
    } else {
      return null;
    }
  };

  const handleUpdateProduct = async () => {
    if (!name || !quantity || !expiryDate) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    const formattedDate = validateDate(expiryDate);

    if (!formattedDate) {
      Alert.alert('Erro', 'Data inválida. Use o formato DD/MM/YYYY ou DD-MM-YYYY.');
      return;
    }

    try {
      await axios.put(`http://192.168.77.54:3000/products/${product.id}`, {
        name,
        quantity,
        expiry_date: formattedDate,
        user_id: product.user_id,
      });

      const response = await axios.get(`http://192.168.77.54:3000/users/${product.user_id}/products`);
      const updatedProducts = response.data;

      navigation.navigate('ProductList', { userId: product.user_id, products: updatedProducts });
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
      <Text>Data de Validade (DD/MM/YYYY ou DD-MM-YYYY)</Text>
      <TextInput
        placeholder="Data de Validade"
        value={expiryDate}
        onChangeText={setExpiryDate}
        style={styles.input}
      />
      <Button title="Atualizar Produto" onPress={handleUpdateProduct} />
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

export default EditProductScreen;
