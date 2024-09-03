import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator, Alert, Switch } from 'react-native';
import axios from 'axios';

const parseRecipesFromText = (text) => {
  // Divide o texto em seções de receita baseadas no formato ## Título ##
  const recipeSections = text.split(/(?=##\s*.*?\s*##)/).filter(section => section.trim() !== '');

  return recipeSections.map((section, index) => {
    // Extrai o título no formato ## Título ##
    const titleMatch = section.match(/##\s*(.*?)\s*##/);
    const title = titleMatch ? titleMatch[1].trim() : `Receita ${index + 1}`;

    // Extrai o conteúdo no formato **Conteúdo**, incluindo ingredientes e preparo
    const contentStartIndex = section.indexOf("**");
    let recipeContent = contentStartIndex !== -1 ? section.substring(contentStartIndex).trim() : '';

    // Remove os asteriscos ** do conteúdo
    recipeContent = recipeContent.replace(/\*\*(.*?)\*\*/g, "-$1");

    console.log("Título da receita:", title);
    console.log("Conteúdo da receita:", recipeContent);

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

  const handleNavigate = (screen) => {
    navigation.navigate(screen, { userId });
  };

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
        <Image style={styles.design} source={require('../assets/desingtopright.png')} />
        <TouchableOpacity onPress={() => setShowRecipes(false)}  style={styles.backContainer}>
          <Image style={styles.back} source={require('../assets/back.png')} />
          <Text style={styles.voltar}>Voltar</Text>
        </TouchableOpacity>
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
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.container}>
        <Image style={styles.design} source={require('../assets/desingtopright.png')} />
        <TouchableOpacity onPress={() => handleNavigate('Dashboard')} style={styles.backContainer}>
          <Image style={styles.back} source={require('../assets/back.png')} />
          <Text style={styles.voltar}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Receitas</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#98FB98',}}></View>
        <View style={styles.emptyContainer}>
          <Image source={require('../assets/imageRecipes.png')} style={styles.emptyImage} />
          <Text style={styles.emptyText}>Nenhum produto disponível</Text>
          <Text style={styles.suggestionText}>Adicione produtos para buscar receitas.</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddProduct', { userId })}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Adicionar Produto</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image style={styles.design} source={require('../assets/desingtopright.png')} />
      <TouchableOpacity onPress={() => handleNavigate('Dashboard')} style={styles.backContainer}>
        <Image style={styles.back} source={require('../assets/back.png')} />
        <Text style={styles.voltar}>Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Receitas</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#98FB98',}}></View>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>Receitas exclusivas para ingredientes selecionados?</Text>
        <Switch
          value={exclusive}
          onValueChange={() => setExclusive(!exclusive)}
          trackColor={{ false: '#C0C0C0', true: '#3CB371' }}
          thumbColor="#FFF"
          style={{ marginTop: '-11%', marginBottom: 10, alignSelf: 'flex-end' }}
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
    fontSize: 30,
    color: '#3CB371',
    fontWeight: 'bold',
    marginBottom: 10,
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
    fontSize: 16,
    color: '#6C6C6C',
  },
  addButton: {
    backgroundColor: '#3CB371',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  ingredientsContainer: {
    // flexDirection: 'row',
    alignSelf: 'auto',
    // flexWrap: 'wrap',
    marginBottom: 20,
    left: 0,
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
    color: '#78746D',textAlign: 'center',
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
    borderColor: '#C0C0C0',
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
    fontWeight: 'bold',
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
    // borderWidth: 1,
    // borderColor: '#BEBAB3',
    // padding: 10,
    // borderRadius: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#78746D',
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
