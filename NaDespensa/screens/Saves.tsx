import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Alert } from 'react-native';

const Saves = ({ navigation, route }) => {
  const { userId } = route.params;
  const [savedItems, setSavedItems] = useState([]); // Lista de itens salvos (inicialmente vazia)
  const [searchText, setSearchText] = useState(''); // Texto da barra de busca

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    // Função para buscar receitas salvas do backend
    const fetchSavedRecipes = async () => {
      try {
        const response = await fetch(`http://192.168.24.5:3000/saved-recipes/${userId}`);
        const data = await response.json();
        if (data.success) {
          setSavedItems(data.recipes);
        } else {
          console.error('Erro ao buscar receitas salvas:', data.error);
        }
      } catch (error) {
        console.error('Erro ao buscar receitas salvas:', error);
      }
    };

    fetchSavedRecipes();
  }, [navigation, userId]);

  const handleNavigate = (screen) => {
    navigation.navigate(screen, { userId });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image source={require('../assets/no-recipes.png')} style={styles.emptyImage} />
      <Text style={styles.emptyTitle}>Nenhuma receita salva</Text>
      <Text style={styles.emptySubtitle}>
        Salve suas receitas favoritas para acessá-las facilmente depois!
      </Text>
      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.goBack()}>
        <Text style={styles.continueButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSavedItem = ({ item }) => (
    <View style={styles.savedItemContainer}>
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <Text style={styles.recipeContent}>{item.content}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => confirmRemoveItem(item.id)}
      >
        <Image style={styles.removeImg} source={require('../assets/desfazer.png')} />
        <Text style={styles.removeButtonText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  // Função para mostrar o alerta de confirmação antes de remover o item
  const confirmRemoveItem = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir esta receita?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => handleRemoveItem(id),
        },
      ],
      { cancelable: false }
    );
  };

  // Função para remover um item salvo, tanto no backend quanto localmente
  const handleRemoveItem = async (id) => {
    try {
      // Requisição DELETE para remover a receita do backend
      const response = await fetch(`http://192.168.24.5:3000/saved-recipes/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        // Remove o item da lista local após a exclusão no backend
        setSavedItems(savedItems.filter((item) => item.id !== id));
      } else {
        console.error('Erro ao remover receita:', data.error);
      }
    } catch (error) {
      console.error('Erro ao remover receita:', error);
    }
  };

  // Filtra itens salvos com base no texto de busca
  const filteredItems = savedItems.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Image style={styles.design} source={require('../assets/desingtopright.png')} />
      <TouchableOpacity onPress={() => handleNavigate('Profile')} style={styles.backContainer}>
        <Image style={styles.back} source={require('../assets/back.png')} />
        <Text style={styles.voltar}>Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Salvos</Text>
      {savedItems.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.listContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar receitas salvas..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={filteredItems}
            renderItem={renderSavedItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    },
    design: {
    width: 220,
    height: 200,
    position: 'absolute',
    right: 0,
    top: 0,
    },
    header: {
    color: '#3CB371',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 20,
    },
    backContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: '15%',
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
    emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
    },
    emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    },
    emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    },
    continueButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    },
    continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    },
    listContainer: {
    flex: 1,
    },
    searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    },
    savedItemContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    elevation: 2,
    },
    recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    },
    recipeContent: {
    fontSize: 16,
    marginBottom: 8,
    },
    removeButton: {
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    },
    removeButtonText: {
    color: '#f44336',
    fontSize: 14,
    },
    removeImg: {
    alignSelf: 'center',
    flexDirection: 'row',
    width: 15,
    height: 13,
    marginRight: 4,
    },
});

export default Saves;
