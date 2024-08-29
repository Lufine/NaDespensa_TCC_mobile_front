import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import axios from 'axios';
import dayjs from 'dayjs';
import { useFocusEffect } from '@react-navigation/native';

const PreExpiryProductListScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [products, setProducts] = useState(route.params.products || []);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://192.168.24.17:3000/pre-expiry-products/${userId}`);
      setProducts(response.data);
      setFilteredProducts(response.data);
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
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const response = await axios.delete(`http://192.168.24.17:3000/products/${productId}`);
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

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredProducts(products);  // Mostra todos os produtos se o campo de pesquisa estiver vazio
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
        <Text style={styles.productDate}>Data de validade: {dayjs(item.expiry_date).format('DD/MM/YYYY')}</Text>
        <Text style={getItemStyle(item.expiry_date)}>Vencimento em {dayjs(item.expiry_date).diff(dayjs(), 'day')} dias</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => handleEditProduct(item)} style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleNavigate('Dashboard')} style={styles.backContainer}>
        <Image style={styles.back} source={require('../assets/back.png')} />
        <Text style={styles.voltar}>Voltar</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquise NaDespensa"
        value={searchText}
        onChangeText={handleSearch}
      />
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={require('../assets/imageAddproduct.png')} style={styles.emptyImage} />
          <Text style={styles.emptyText}>Nenhum alimento encontrado</Text>
          <Text style={styles.suggestionText}>Você não possui nenhum alimento perto do vencimento!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.product_id ? item.product_id.toString() : Math.random().toString()}
          renderItem={renderItem}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddProduct', { userId })}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.recipesButton} onPress={() => navigation.navigate('Recipes', { userId })}>
        <Text style={styles.recipesButtonText}>Ver receitas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
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
  searchInput: {
    borderColor: '#A9E6AF',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
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
  editButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
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
});

export default PreExpiryProductListScreen;
