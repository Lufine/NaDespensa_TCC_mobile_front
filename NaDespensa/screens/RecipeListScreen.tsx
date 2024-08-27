import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const parseRecipesFromText = (text) => {
  // Divida o texto em seções de receita com base no cabeçalho das receitas
  const recipeSections = text.split(/(?=\*\d+\.\s)/).filter(section => section.trim() !== '');

  console.log("Seções de receita:", recipeSections); // Depuração

  return recipeSections.map((section, index) => {
    // Extraia o título da receita
    const titleMatch = section.match(/\*\d+\.\s*(.*?)\*\*/);
    const title = titleMatch ? titleMatch[1].trim() : `Receita ${index + 1}`;

    console.log("Título da receita:", title); // Depuração

    // Extraia a receita completa (incluindo ingredientes e preparo)
    const recipeContent = section.replace(/\*\d+\.\s.*?\*\*/, '').trim();
    
    console.log("Conteúdo da receita:", recipeContent); // Depuração

    return {
      title,
      content: recipeContent
    };
  });
};


const RecipesScreen = ({ route }) => {
  const { userId } = route.params;
  const [products, setProducts] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRecipes, setShowRecipes] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://192.168.24.17:3000/users/${userId}/products`);
        console.log('Produtos recebidos:', response.data); // Log dos produtos recebidos
        const productNames = response.data.map(product => ({ name: product.name, isSelected: false }));
        setProducts(productNames);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        Alert.alert('Erro', 'Não foi possível carregar os produtos.');
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
    setLoading(true);
    setError(null);

    console.log('Ingredientes selecionados:', selectedIngredientsNames); // Log dos ingredientes selecionados

    try {
      const response = await axios.post('http://192.168.24.17:3000/recipes', { ingredients: selectedIngredientsNames });
      console.log('Resposta da API:', response.data); // Log da resposta da API

      // Processar o texto da resposta e converter para um formato de receitas
      const recipesData = parseRecipesFromText(response.data.recipe);
      console.log('Receitas processadas:', recipesData); // Log das receitas processadas
      setRecipes(recipesData);
      setShowRecipes(true);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      Alert.alert('Erro', 'Não foi possível gerar receitas.');
      setError('Erro ao buscar receitas.');
    } finally {
      setLoading(false);
    }
  };

  const isSearchEnabled = products.some(product => product.isSelected);

  if (showRecipes) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <View key={index} style={styles.recipeCard}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeContent}>{recipe.content}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noRecipesText}>Nenhuma receita encontrada.</Text>
          )}
        </ScrollView>
        <TouchableOpacity onPress={() => setShowRecipes(false)} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.ingredientsContainer}>
        {products.map((product, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.ingredientButton, product.isSelected && styles.selectedIngredientButton]}
            onPress={() => toggleIngredientSelection(product.name)}
          >
            <Text style={styles.ingredientButtonText}>{product.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={searchRecipes} disabled={!isSearchEnabled} style={[styles.button, !isSearchEnabled && styles.disabledButton]}>
        <Text style={styles.buttonText}>Buscar Receitas</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#3CB371" style={styles.loader} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  scrollView: {
    flex: 1,
  },
  recipeCard: {
    marginBottom: 40, // Aumenta o espaçamento entre receitas
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeContent: {
    fontSize: 14,
    lineHeight: 22, // Aumenta o espaçamento entre linhas do conteúdo da receita
  },
  noRecipesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default RecipesScreen;