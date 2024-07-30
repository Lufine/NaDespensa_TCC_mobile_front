import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { format, parse, isValid } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProductScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [price, setPrice] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanning, setScanning] = useState(false); // Controle de leitura

  const { userId } = route.params;
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

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

  const handleAddProduct = async () => {
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
      const productResponse = await axios.post('http://192.168.24.17:3000/products', {
        name,
        price: parseFloat(price),
        thumbnail,
        barcode: barcodeInput.trim(),
      });

      const productId = productResponse.data.id;

      await axios.post('http://192.168.24.17:3000/users-products', {
        quantity: parseInt(quantity, 10),
        expiry_date: formattedDate,
        price: parseFloat(price),
        user_id: userId,
        product_id: productId,
      });

      const response = await axios.get(`http://192.168.24.17:3000/users/${userId}/products`);
      const updatedProducts = response.data;

      navigation.navigate('ProductList', { userId, products: updatedProducts });
    } catch (error) {
      console.error('Erro ao adicionar produto:', error.response ? error.response.data : error.message);
      Alert.alert('Erro', 'Falha ao adicionar produto. Verifique os dados e tente novamente.');
    }
  };

  const handleBarcodeScanned = ({ data }) => {
    if (!scanning) { // Verifica se o scanner está ativo
      setScanning(true); // Define como ativo
      setBarcodeInput(data);
      fetchProductDetails(data);
      setModalVisible(false);
      setTimeout(() => setScanning(false), 1000); // Reativa após 1 segundo
    }
  };

  const fetchProductDetails = async (barcode) => {
    try {
      const response = await fetch(`https://api.cosmos.bluesoft.com.br/gtins/${barcode}`, {
        headers: {
          'X-Cosmos-Token': 'Gqi8ZqgjbT6lzxd-iG9smw',
          'User-Agent': 'Cosmos-API-Request'
        }
      });
      const data = await response.json();

      setName(data.description || '');
      setThumbnail(data.thumbnail || '');
      setPrice(data.price || '');
      setExpiryDate('');

      Alert.alert('Produto Encontrado', `Descrição: ${data.description}\nPreço: ${data.price}`);
    } catch (error) {
      console.error('Erro ao buscar produto:', error.message);
      Alert.alert('Erro', 'Não foi possível encontrar o produto.');
    }
  };

  const handleOpenScanner = () => {
    if (hasCameraPermission) {
      setModalVisible(true);
    } else {
      Alert.alert('Erro', 'Permissão de acesso à câmera negada');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Button title="Escanear Código de Barras" onPress={handleOpenScanner} />

        <Text>Imagem do Produto</Text>
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        ) : (
          <Text style={styles.hiddenImageText}>Imagem não disponível</Text>
        )}

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

        <Text>Preço</Text>
        <TextInput
          placeholder="Preço"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          keyboardType="numeric"
        />

        <Text>Código de Barras</Text>
        <TextInput
          placeholder="Código de Barras"
          value={barcodeInput}
          onChangeText={setBarcodeInput}
          style={styles.input}
        />
        <Button title="Buscar Produto" onPress={() => fetchProductDetails(barcodeInput)} />

        <Button title="Adicionar Produto" onPress={handleAddProduct} />

        {/* Modal para Scanner de Código de Barras */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <BarCodeScanner
              onBarCodeScanned={handleBarcodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
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
  thumbnail: {
    width: 150,
    height: 150,
    marginVertical: 10,
    borderWidth: 1,
    margin: 'auto',
    borderColor: '#ccc',
  },
  hiddenImageText: {
    color: '#888',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'black',
  },
});

export default AddProductScreen;
