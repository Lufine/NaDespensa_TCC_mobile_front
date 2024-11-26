import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import dayjs from 'dayjs';
import { useFocusEffect } from '@react-navigation/native';

const ProductListScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [products, setProducts] = useState(route.params.products || []);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://192.168.24.5:3000/users-products/${userId}`);
      setProducts(response.data);
      setFilteredProducts(response.data);  // Inicia com todos os produtos carregados
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
    }
  };

  useEffect(() => {
    fetchProducts();
    navigation.setOptions({
      headerShown: false,
    });
    
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleNavigate = (screen) => {
    navigation.navigate(screen, { userId });
  };

  const handleEditProduct = (product) => {
    navigation.navigate('EditProduct', { product });
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert(
      "Confirmação",
      "Você tem certeza que deseja excluir este produto?",
      [
        {
          text: "Não",
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: async () => {
            try {
              const response = await axios.delete(`http://192.168.24.5:3000/products/${productId}`);
              if (response.data.success) {
                setProducts(products.filter((product) => product.id !== productId));
                setFilteredProducts(filteredProducts.filter((product) => product.id !== productId));
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
      return styles.expiredItemText;
    } else if (diffDays <= 5) {
      return styles.warningItemText;
    } else {
      return styles.normalItemText;
    }
  };

  const getExpiryText = (expiryDate) => {
    const today = dayjs();
    const expiry = dayjs(expiryDate);
    const diffDays = expiry.diff(today, 'day');
  
    if (diffDays < 0) {
      return `Vencido há ${Math.abs(diffDays)} dias`;
    } else {
      return `Vencimento em ${diffDays} dias`;
    }
  };

  const getCalendarIcon = (expiryDate) => {
    const today = dayjs();
    const expiry = dayjs(expiryDate);
    const diffDays = expiry.diff(today, 'day');
  
    if (diffDays < 0) {
      return require('../assets/calendarred.png');
    } else if (diffDays <= 5) {
      return require('../assets/calendaryellow.png');
    } else {
      return require('../assets/calendargreen.png');
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.productItem}>
      <Text style={styles.indexText}>{index + 1}</Text>
      <Image
        source={item.thumbnail ? { uri: item.thumbnail } : require('../assets/produto-sem-imagem.png')}
        style={styles.productImage}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDate}>Quantidade: {item.quantity}</Text>
        <Text style={styles.productDate}>Data de validade: {dayjs(item.expiry_date).format('DD/MM/YYYY')}</Text>
        <View style={styles.dateRow}>
          <Image style={styles.calendarIcon} source={getCalendarIcon(item.expiry_date)} />
          <Text style={getItemStyle(item.expiry_date)}>{getExpiryText(item.expiry_date)}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => handleEditProduct(item)} style={styles.editar}>
            <Image style={styles.edit} source={require('../assets/edit.png')} />
            <View style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.deletar}>
            <Image style={styles.delete} source={require('../assets/excluir.png')} />
            <View style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image style={styles.design} source={require('../assets/desingtopright.png')} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backContainer}>
          <Image style={styles.back} source={require('../assets/back.png')} />
          <Text style={styles.voltar}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Lista de produtos</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#98FB98',}}></View>
        <View style={styles.search}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquise NaDespensa"
            value={searchText}
            onChangeText={handleSearch}
          />
          <Image style={styles.searchIcon} source={require('../assets/search.png')} />
        </View>
        {filteredProducts.length === 0 && !isKeyboardVisible ? (
            <View style={styles.emptyContainer}>
              <Image source={require('../assets/imageAddproduct.png')} style={styles.emptyImage} />
              <Text style={styles.emptyText}>Alimento não encontrado</Text>
              <Text style={styles.suggestionText}>Tente pesquisar o alimento com uma palavra-chave diferente</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.product_id ? item.product_id.toString() : Math.random().toString()}
              renderItem={renderItem}
              keyboardShouldPersistTaps='handled'
            />
          )}
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddProduct', { userId })}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.recipesButton} onPress={() => navigation.navigate('Recipes', { userId })}>
          <Text style={styles.recipesButtonText}>Ver receitas</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
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
  },
  search:{
    flexDirection: 'row',
    borderColor: '#A9E6AF',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
  },
  searchInput: {
    padding: 10,
    width: '100%',
    fontSize: 16,
  },
  searchIcon:{
    margin: 'auto',
    right: '60%',
    width: 25,
    height: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  indexText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDate: {
    fontSize: 14,
    color: '#6C6C6C',
    marginBottom: 5,
  },
  expiredItemText: {
    color: '#FF4C4C',
    fontSize: 14,
  },
  warningItemText: {
    color: '#FFA500',
    fontSize: 14,
  },
  normalItemText: {
    color: '#28a745',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editar:{
    flexDirection: 'row',
  },
  edit:{
    top: '3%',
    left: 5,
    width: 20,
    height: 20,
  },
  editButton: {
    // backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: '#007BFF',
  },
  deletar:{
    flexDirection: 'row',
  },
  delete:{
    top: '3%',
    left: 5,
    width: 20,
    height: 20,
  },
  deleteButton: {
    // backgroundColor: '#FF4C4C',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FF4C4C',
  },
  addButton: {
    backgroundColor: '#3CB371',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  recipesButton: {
    backgroundColor: '#1877F2',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  recipesButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: '#6C6C6C',
    textAlign: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});

export default ProductListScreen;
