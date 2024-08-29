import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, Image, TouchableOpacity, Platform } from 'react-native';
import axios from 'axios';
import { format, parse, isValid } from 'date-fns';

const EditProductScreen = ({ route, navigation }) => {
  const { product, userId } = route.params;
  const [name, setName] = useState(product.name);
  const [quantity, setQuantity] = useState(product.quantity.toString());
  const [expiryDate, setExpiryDate] = useState(
    product.expiry_date ? format(parse(product.expiry_date, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy') : ''
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const validateDate = (date) => {
    const parsedDate1 = parse(date, 'dd/MM/yyyy', new Date());
    const parsedDate2 = parse(date, 'dd-MM-yyyy', new Date());
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
      await axios.put(`http://192.168.24.17:3000/users-products/${product.id}`, {
        name,
        quantity,
        expiry_date: formattedDate,
      });

      // Atualize a lista de produtos após a edição
      const response = await axios.get(`http://192.168.24.17:3000/users-products/${userId}`);
      const updatedProducts = response.data;

      // Voltar à tela anterior e passar os produtos atualizados
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar o produto');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} keyboardShouldPersistTaps='handled'>
      <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}style={styles.backContainer}>
        <Image style={styles.back} source={require('../assets/back.png')} />
        <Text style={styles.voltar}>Voltar</Text>
      </TouchableOpacity>
        <Image style={styles.design} source={require('../assets/desingtopright.png')} />
        <Text style={styles.title}>Editar Produto</Text>

        <View style={styles.inputContainer}>
          <Image source={require('../assets/nameprod.png')} style={styles.icon} />
          <TextInput
            placeholder="Nome"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={require('../assets/imagequantidade.png')} style={styles.icon} />
          <TextInput
            placeholder="Quantidade"
            value={quantity}
            onChangeText={setQuantity}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={require('../assets/clock.png')} style={styles.icon} />
          <TextInput
            placeholder="Data de Validade (DD/MM/YYYY)"
            value={expiryDate}
            onChangeText={setExpiryDate}
            style={styles.input}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProduct}>
            <Text style={styles.saveButtonText}>Atualizar</Text>
          </TouchableOpacity>
        </View>
        <Image style={styles.designunder} source={require('../assets/designunder.png')} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    position: 'relative',
  },
  design: {
    width: 200,
    height: 150,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: '15%',
    marginBottom: '5%',
  },
  back: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  voltar: {
    color: '#3CB371',
    fontSize: 16,
  },
  title: {
    color: '#3CB371',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    marginTop: '40%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3CB371',
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#78746D',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    width: '48%',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#3CB371',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    width: '48%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  designunder: {
    width: '115%',
    height: 200,
    bottom: '-30%',
    left: '-8%',
  },
});

export default EditProductScreen;
