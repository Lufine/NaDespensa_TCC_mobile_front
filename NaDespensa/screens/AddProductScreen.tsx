import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { format, parse, isValid } from 'date-fns';
import DashboardScreen from './DashboardScreen';

const AddProductScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [price, setPrice] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanning, setScanning] = useState(false);

  const { userId } = route.params;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Reseta os estados ao entrar na tela
      setName('');
      setQuantity('');
      setExpiryDate('');
      setBarcodeInput('');
      setThumbnail('');
      setPrice('');
      setModalVisible(false);
    }, [])
  );

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

  const formatDate = (text) => {
    // Remove tudo que não for número
    let cleaned = text.replace(/\D/g, '');
    
    // Se o usuário está deletando (string vazia ou com menos de 2 caracteres), apenas retorna o texto limpo
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 2) return cleaned;
    
    // Adiciona barras (/) automaticamente conforme o usuário digita
    if (cleaned.length <= 4) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
  };

  const formatPrice = (text) => {
    // Remove tudo que não for número
    let cleaned = text.replace(/\D/g, '');
    // Adiciona vírgula para separar os centavos
    cleaned = (parseFloat(cleaned) / 100).toFixed(2).replace('.', ',');
    return cleaned;
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen, { userId });
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
      const productResponse = await axios.post('http://192.168.24.5:3000/products', {
        name,
        price: parseFloat(price),
        thumbnail,
        barcode: barcodeInput.trim(),
      });

      const productId = productResponse.data.id;

      await axios.post('http://192.168.24.5:3000/users-products', {
        quantity: parseInt(quantity, 10),
        expiry_date: formattedDate,
        price: parseFloat(price),
        user_id: userId,
        product_id: productId,
      });

      const response = await axios.get(`http://192.168.24.5:3000/users/${userId}/products`);
      const updatedProducts = response.data;

      navigation.navigate('ProductList', { userId, products: updatedProducts });
    } catch (error) {
      console.error('Erro ao adicionar produto:', error.response ? error.response.data : error.message);
      Alert.alert('Erro', 'Falha ao adicionar produto. Verifique os dados e tente novamente.');
    }
  };

  const handleBarcodeScanned = ({ data }) => {
    if (!scanning) {
      setScanning(true);
      setBarcodeInput(data);
      fetchProductDetails(data);
      setModalVisible(false);
      setTimeout(() => setScanning(false), 1000);
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

      const name = data.description.split(" ").slice(0, 2).join(" ");
      setName(name);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      <Image style={styles.design} source={require('../assets/desingtopright.png')} />
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()}style={styles.backContainer}>
          <Image style={styles.back} source={require('../assets/back.png')} />
          <Text style={styles.voltar}>Voltar</Text>
        </TouchableOpacity>
          <Text style={styles.title}>Adicionar produto</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={handleOpenScanner} style={styles.iconButton}>
              <Image source={require('../assets/barcode.png')} style={styles.icon} />
            </TouchableOpacity>
            <TextInput
              placeholder="Código de Barras"
              value={barcodeInput}
              keyboardType="number-pad"
              onChangeText={(text) => {
                setBarcodeInput(text);
                if (text.length === 13) {
                  fetchProductDetails(text);
                }
              }}
              style={styles.input}
            />
            <TouchableOpacity onPress={handleOpenScanner} style={styles.iconButton}>
              <Image source={require('../assets/cam.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleOpenScanner}>
          <Text style={styles.barcodetext}>Escanear código de barras</Text>
          </TouchableOpacity>
          <Text style={{color: '#78746D'}}>Imagem do Produto</Text>
          {thumbnail ? (
            <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
          ) : (
            <Image source={require('../assets/produto-sem-imagem.png')} style={styles.thumbnail} />
          )}
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
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Image source={require('../assets/clock.png')} style={styles.icon} />
            <TextInput
              placeholder="Data de Validade (DD/MM/YYYY)"
              value={expiryDate}
              onChangeText={(text) => setExpiryDate(formatDate(text))}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Image source={require('../assets/price.png')} style={styles.icon} />
            <TextInput
              placeholder="Preço"
              value={price}
              onChangeText={(text) => setPrice(formatPrice(text))}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => handleNavigate('Dashboard')}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddProduct}>
              <Text style={styles.saveButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
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
      </ScrollView>
      </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    padding: 20,
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
    marginTop: '20%',
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
  barcodetext:{
    marginTop: -5,
    marginBottom: 10,
    alignSelf: 'center',
    color: '#1877F2',
  },
  thumbnail: {
    width: 150,
    height: 150,
    marginVertical: 15,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
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
});

export default AddProductScreen;
