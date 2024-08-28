import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator, Alert, Switch  } from 'react-native';
import axios from 'axios';

const parseRecipesFromText = (text) => {
  const recipeSections = text.split(/(?=\*\d+\.\s)/).filter(section => section.trim() !== '');

  return recipeSections.map((section, index) => {
    const titleMatch = section.match(/\*\d+\.\s*(.*?)\*\*/);
    const title = titleMatch ? titleMatch[1].trim() : `Receita ${index + 1}`;
    const recipeContent = section.replace(/\*\d+\.\s.*?\*\*/, '').trim();
    console.log("Título da receita:", title);
    return {
      title,
      content: recipeContent
    };
  });
};

const RecipesScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [products, setProducts] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRecipes, setShowRecipes] = useState(false);
  const [visibleRecipes, setVisibleRecipes] = useState(10); // Estado para controlar quantas receitas são exibidas
  const [exclusive, setExclusive] = useState(false); // Novo estado para controle de exclusividade

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://192.168.24.17:3000/users/${userId}/products`);
        const productNames = response.data.map(product => ({ name: product.name, isSelected: false }));
        setProducts(productNames);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        Alert.alert('Erro', 'Não foi possível carregar os produtos.');
      }
    };

    fetchProducts();
    navigation.setOptions({
      headerShown: false,
    });
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

    console.log('Ingredientes selecionados:', selectedIngredientsNames);

    try {
      const endpoint = exclusive ? 'http://192.168.24.17:3000/recipes/exclusive' : 'http://192.168.24.17:3000/recipes';
      const response = await axios.post(endpoint, { 
        ingredients: selectedIngredientsNames
      });
      const recipesData = parseRecipesFromText(response.data.recipe);
      setRecipes(recipesData);
      setShowRecipes(true);
      setVisibleRecipes(3); // Resetar o número de receitas visíveis ao buscar novas receitas
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      Alert.alert('Erro', 'Não foi possível gerar receitas.');
      setError('Erro ao buscar receitas.');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreRecipes = () => {
    setVisibleRecipes(prevVisible => prevVisible + 3);
  };

  const isSearchEnabled = products.some(product => product.isSelected);

  if (showRecipes) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {recipes.length > 0 ? (
            recipes.slice(0, visibleRecipes).map((recipe, index) => ( // Mostrar apenas o número de receitas visíveis
              <View key={index} style={styles.recipeCard}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeContent}>{recipe.content}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noRecipesText}>Nenhuma receita encontrada.</Text>
          )}
        </ScrollView>
        {visibleRecipes < recipes.length && ( // Mostrar o botão "Gerar mais receitas" apenas se houver mais receitas para mostrar
          <TouchableOpacity onPress={loadMoreRecipes} style={styles.loadMoreButton}>
            <Text style={styles.loadMoreButtonText}>Gerar mais receitas</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setShowRecipes(false)} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backContainer}>
        <Image style={styles.back} source={require('../assets/back.png')} />
        <Text style={styles.voltar}>Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Receitas</Text>
      <View style={styles.optionContainer}>
      <Text style={styles.optionText}>Receitas exclusivas para ingredientes selecionados?</Text>
      <Switch
        value={exclusive}
        onValueChange={() => setExclusive(!exclusive)}
        trackColor={{ false: '#C0C0C0', true: '#3CB371' }}
        thumbColor="#FFF"
        style={{marginTop: -55, marginBottom: 10}}
      />
    </View>

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
      <TouchableOpacity
        onPress={searchRecipes}
        disabled={!isSearchEnabled}
        style={[styles.button, !isSearchEnabled && styles.disabledButton]}
      >
        <Text style={styles.buttonText}>Buscar Receitas</Text>
      </TouchableOpacity>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#3CB371" style={styles.loader} />
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 30,
    marginBottom: 10,
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
    fontSize: 30,
    color: '#3CB371',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredientsContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  ingredientButton: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: '#3CB371',
  },
  selectedIngredientButton: {
    backgroundColor: '#3CB371',
  },
  ingredientButtonText: {
    fontSize: 16,
    color: '#78746D',
  },
  button: {
    backgroundColor: '#3CB371',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3CB371',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#C0C0C0',
    borderWidth: 1,
    borderColor: '#3CB371',
  },
  scrollView: {
    flex: 1,
  },
  recipeCard: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: '10%',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  noRecipesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadMoreButton: {
    backgroundColor: '#3CB371',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  loadMoreButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#3CB371',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionContainer: {
    marginVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#78746D',
    marginBottom: 5,
  },
  optionButton: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#3CB371',
  },
  selectedOptionButton: {
    backgroundColor: '#3CB371',
  },
  optionButtonText: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#78746D',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default RecipesScreen;
