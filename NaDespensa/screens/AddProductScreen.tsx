import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import axios from 'axios';
import { format, parse, isValid } from 'date-fns';
import { RNCamera } from 'react-native-camera';

const AddProductScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [price, setPrice] = useState('');
  const [scanning, setScanning] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef(null);

  const { userId } = route.params;

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
      await axios.post('http://192.168.24.17:3000/products', {
        name,
        quantity: parseInt(quantity, 10),
        expiry_date: formattedDate,
        price: parseFloat(price), // Assegure-se de enviar como número flutuante
        thumbnail,
        barcode: barcodeInput.trim(), // Assegure-se de que está enviando o valor correto
        user_id: userId,
      });
  
      const response = await axios.get(`http://192.168.24.17:3000/users/${userId}/products`);
      const updatedProducts = response.data;
  
      navigation.navigate('ProductList', { userId, products: updatedProducts });
    } catch (error) {
      console.error('Erro ao adicionar produto:', error.response ? error.response.data : error.message);
      Alert.alert('Erro', 'Falha ao adicionar produto. Verifique os dados e tente novamente.');
    }
  };

  const fetchProductDetails = async (barcode) => {
    try {
      // Registra a consulta do código de barras
      await axios.post('http://192.168.24.17:3000/log-barcode-consumption', {
        barcode
      });

      // Busca os detalhes do produto
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
      setExpiryDate('');  // você pode definir um valor padrão para data ou deixar em branco

      Alert.alert('Produto Encontrado', `Descrição: ${data.description}\nPreço: ${data.price}`, [
        { text: 'OK', onPress: () => setCameraVisible(false) },
      ]);
    } catch (error) {
      console.error('Erro ao buscar produto:', error.message);
      Alert.alert('Erro', 'Não foi possível encontrar o produto.');
    }
  };

  const handleBarcodeRead = async (barcode) => {
    if (scanning) return;
    setScanning(true);
    await fetchProductDetails(barcode.data);
    setScanning(false);
  };

  const handleManualBarcodeSearch = () => {
    if (barcodeInput.trim() === '') {
      Alert.alert('Erro', 'Código de barras não pode estar vazio');
      return;
    }
    fetchProductDetails(barcodeInput.trim());
  };

  const toggleCamera = () => {
    setCameraVisible(!cameraVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {cameraVisible ? (
          <View style={styles.cameraContainer}>
            <RNCamera
              ref={cameraRef}
              style={styles.camera}
              onBarCodeRead={handleBarcodeRead}
              captureAudio={false}
            />
            <Button title="Fechar Câmera" onPress={() => setCameraVisible(false)} />
          </View>
        ) : (
          <>
            <Button title="Escanear Código de Barras" onPress={toggleCamera} />

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
            <Button title="Buscar Produto" onPress={handleManualBarcodeSearch} />

            <Button title="Adicionar Produto" onPress={handleAddProduct} />
          </>
        )}
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
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
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
});

export default AddProductScreen;
