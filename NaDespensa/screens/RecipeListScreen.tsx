import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import axios from 'axios';

const RecipesScreen = ({ route }) => {
  const { userId } = route.params;
  const [products, setProducts] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [showWebView, setShowWebView] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://192.168.77.54:3000/users/${userId}/products`);
        const productNames = response.data.map(product => ({ name: product.name, isSelected: false }));
        setProducts(productNames);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [userId]);

  const toggleIngredientSelection = (ingredientName) => {
    const updatedProducts = products.map(product => {
      if (product.name === ingredientName) {
        return { ...product, isSelected: !product.isSelected };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const searchRecipes = async () => {
    const selectedIngredientsNames = products.filter(product => product.isSelected).map(product => product.name);
    setSelectedIngredients(selectedIngredientsNames);
    setShowWebView(true);
  };

  const isSearchEnabled = products.some(product => product.isSelected);

  return (
    <View style={styles.container}>
      <View style={styles.ingredientsContainer}>
        {products.map((product, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.ingredientButton, product.isSelected && styles.selectedIngredientButton]}
            onPress={() => toggleIngredientSelection(product.name)}
          >
            <Text style={styles.ingredientButtonText}>{product.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={searchRecipes} disabled={!isSearchEnabled} style={[styles.button, !isSearchEnabled && styles.disabledButton]}>
        <Text style={styles.buttonText}>Buscar Receitas</Text>
      </TouchableOpacity>
      {showWebView && (
        <WebView
          source={{ uri: `https://www.tudogostoso.com.br/busca?q=${encodeURIComponent(selectedIngredients.join(' '))}` }}
          style={{ marginTop: 20, flex: 1 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  ingredientButton: {
    backgroundColor: '#DDDDDD',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
  },
  selectedIngredientButton: {
    backgroundColor: 'blue',
  },
  ingredientButtonText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
});

export default RecipesScreen;
