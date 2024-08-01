import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import NavigationFooter from './FooterPerfil';

const ProfileScreen = ({ navigation, route }) => {
  const { userId } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleNavigate = (screen) => {
    navigation.navigate(screen, { userId });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backContainer}>
        <Image style={styles.back} source={require('../assets/back.png')} />
        <Text style={styles.voltar}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Perfil</Text>
      <Image source={require('../assets/profile.png')} style={styles.profileImage} />
      <TouchableOpacity style={styles.button} onPress={() => handleNavigate('ProductList')}>
        <Text style={styles.buttonText}>Sua Despensa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleNavigate('Salvos')}>
        <Text style={styles.buttonText}>Salvos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleNavigate('HelpOne')}>
        <Text style={styles.buttonText}>Introdução</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        navigation.navigate('Login');
      }}>
        <Text style={styles.sair}>Sair</Text>
      </TouchableOpacity>
      <NavigationFooter handleNavigate={handleNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: '25%',
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
  header: {
    color: '#3CB371',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  profileImage: {
    alignSelf: 'center',
    width: 180,
    height: 180,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3CB371',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold'
  },
  sair: {
    alignSelf: 'center',
    color: '#FF0000',
    fontSize: 18,
    marginTop: 20,
  },
});

export default ProfileScreen;
