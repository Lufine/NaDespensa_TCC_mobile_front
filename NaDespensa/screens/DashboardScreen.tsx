import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import NavigationFooter from './FooterDespensa';

const DashboardScreen = ({ route, navigation }) => {
  const [userData, setUserData] = useState(null);
  const [expiredItemsCount, setExpiredItemsCount] = useState(0);
  const [nearExpiryItemsCount, setNearExpiryItemsCount] = useState(0);

  const { userId } = route.params;

  useEffect(() => {
    fetchUserData();
    fetchItemCounts();
    navigation.setOptions({
        headerShown: false,
    });
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://192.168.24.17:3000/users/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
    }
  };

  const fetchItemCounts = async () => {
    try {
      const expiredResponse = await axios.get(`http://192.168.24.17:3000/expiry-products-count/${userId}`);
      const nearExpiryResponse = await axios.get(`http://192.168.24.17:3000/pre-expiry-products-count/${userId}`);

      setExpiredItemsCount(expiredResponse.data.count);
      setNearExpiryItemsCount(nearExpiryResponse.data.count);
    } catch (error) {
      console.error('Erro ao buscar contagem de itens:', error);
      Alert.alert('Erro', 'Não foi possível carregar a contagem de itens');
    }
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen, { userId });
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
          <Image style={styles.design} source={require('../assets/desingtopright.png')} />
          <Text style={styles.greeting}>Olá,</Text>
          <Text style={styles.username}>{userData.nome}</Text>
          <TouchableOpacity onPress={() => handleNavigate('Config')}>
          <Image source={require('../assets/alarm.png')} style={styles.notifications}/>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', padding: 10, top: '10%', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#3CB371',}}>{userData.notifications}</View>
          <View style={styles.infoContainer}>
            <TouchableOpacity style={styles.infoBox} onPress={() => handleNavigate('ExpiryProductList')}>
              <Text style={styles.infoCount}>{expiredItemsCount}</Text>
              <Text style={styles.infoLabel}>Itens vencidos</Text>
              <Image source={require('../assets/cancel.png')} style={styles.cancelImage}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoBox} onPress={() => handleNavigate('PreExpiryProductList')}>
              <Text style={styles.infoCountVencer}>{nearExpiryItemsCount}</Text>
              <Text style={styles.infoLabel}>Itens a vencer</Text>
              <Image source={require('../assets/time.png')} style={styles.cancelTime}/>
            </TouchableOpacity>
          </View>
          
            <TouchableOpacity onPress={() => handleNavigate('ProductList')}>
                <Image source={require('../assets/cesta.png')} style={styles.basketImage} />
                <Text style={styles.textItens}>Todos os itens</Text>
            </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('Recipes')}>
            <Text style={styles.buttonText}>Ver receitas NaDespensa</Text>
            <Image source={require('../assets/search.png')} style={styles.search}/>
            <Image source={require('../assets/barcode.png')} style={styles.barcode}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNavigate('AddProduct')}>
            <Text style={styles.buttonText}>Adicionar item NaDespensa</Text>
            <Image source={require('../assets/plus.png')} style={styles.add}/>
            <Image source={require('../assets/barcode.png')} style={styles.barcode} />
          </TouchableOpacity>
          </View>
          <NavigationFooter handleNavigate={handleNavigate} currentScreen="Dashboard" />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    top: {
        top: '10%',
    },
    design: {
        width: 220,
        height: 200,
        position: 'absolute',
        right: "-10%",
        top: "-20%",
    },
    greeting: {
        fontSize: 20,
        color: '#3CB371',
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3CB371',
    },
    cancelImage: {
        width: 20,
        height: 20,
        right: 30,
        top: '-59%',
    },
    cancelTime: {
        width: 14,
        height: 18,
        right: 30,
        top: '-58%',
    },
    notifications: {
        width: 40,
        height: 40,
        position: 'absolute',
        right: 50,
        top: -40,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginTop: 40,
    },
    infoBox: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 5,
    },
    infoCount: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF0000',
    },
    infoCountVencer: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6B00',
    },
    infoLabel: {
        marginTop: 10,
        fontSize: 14,
        color: '#666',
    },
    basketImage: {
        top: 0,
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 10,
    },
    textItens: {
        top: '-5%',
        fontSize: 20,
        color: '#78746D',
        textAlign: 'center',
        marginBottom: 50,
    },
    barcode: {
        width: 30,
        height: 30,
        top: '-60%',
        alignSelf: 'flex-end',
        right: 10,
    },
    search: {
        width: 17,
        height: 19,
        top: '-35%',
        alignSelf: 'flex-start',
        left: 10,
    },
    add: {
        width: 20,
        height: 20,
        top: '-35%',
        alignSelf: 'flex-start',
        left: 10,
    },
    button:{
        marginTop: -30,
    },
    buttonText: {
        color: '#78746D',
        fontSize: 16,
        backgroundColor: 'transparent', 
        borderWidth: 1, 
        borderColor: '#3CB371', 
        padding: 10, 
        borderRadius: 5, 
        textAlign: 'center',
    },
});

export default DashboardScreen;
