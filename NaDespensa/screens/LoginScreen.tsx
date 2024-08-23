import React, { useState, useEffect } from 'react';
import { Image, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity, Text } from 'react-native';
import { View, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from './NotificationService';

const LoginScreen = ({ navigation }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.24.17:3000/login', { emailOrUsername, senha });
      if (response.data.success) {
        // Armazenar o userId
        await AsyncStorage.setItem('userId', response.data.userId.toString());

        // Verificar se as notificações estão habilitadas
        const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
        if (notificationsEnabled === 'true') {
          // Iniciar o serviço de notificações
          await notificationService.checkAndSendNotifications(response.data.userId);
        }

        navigation.navigate('Dashboard', { userId: response.data.userId });
      } else {
        alert('Credenciais inválidas');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container}>
        <Image style={styles.image} source={require('../assets/logodespensa.png')} />
        <Text style={styles.Title}>NaDespensa</Text>
        <Text style={styles.Textlogin}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email ou nome de usuário"
            value={emailOrUsername}
            onChangeText={setEmailOrUsername}
            style={styles.input}
          />
          <Image style={styles.userLogo} source={require('../assets/user.png')} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
            secureTextEntry={!isPasswordVisible}
          />
          <Image style={styles.userLogo} source={require('../assets/cadeado.png')} />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Image
              style={styles.userLogoShow}
              source={isPasswordVisible ? require('../assets/hidepass.png') : require('../assets/showpass.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.forget} onPress={() => navigation.navigate('ForgotPassword')}>Esqueceu a senha?</Text>
        <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <Text style={styles.register}>
          Não tem conta?{' '}
          <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}> Inscreva-se!</Text>
        </Text>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#fff',
    },
    image: {
      textAlign: 'left',
      width: 130,
      height: 110,
      marginTop: -130,
      marginBottom: 50,
      borderRadius: 20,
      shadowColor: '#000000',
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.5,
    },
    Title: {
      fontSize: 35,
      fontWeight: 'bold',
      color: '#3CB371',
      marginTop: -120,
      marginLeft: '37%',
      marginRight: '0.2%',
      display: 'flex',
      textAlign: 'center',
      marginBottom: 60,
    },
    textStart: {
      textAlign: 'left',
      marginTop: 10,
      marginBottom: 5,
      color: '#3CB371',
    },
    userLogo: {
      width: 20,
      height: 20,
      position: 'absolute',
      left: 10,
      top: '50%',
      transform: [{ translateY: -15 }],
    },
    userLogoShow: {
      width: 20,
      height: 20,
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: [{ translateY: -40 }],
    },
    Textlogin: {
      fontSize: 30,
      textAlign: 'left',
      marginTop: 20,
      marginBottom: 20,
      color: '#3CB371',
      fontWeight: 'bold',
    },
    forget: {
      textAlign: 'right',
      marginTop: 10,
      marginBottom: 50,
      color: '#3CB371',
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    inputContainer: {
      position: 'relative',
    },
    input: {
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      paddingLeft: 40,
      borderColor: '#3CB371',
    },
    buttonLogin: {
      margin: 'auto',
      marginTop: 20,
      marginBottom: 10,
      borderRadius: 45,
      width: 320,
      backgroundColor: '#3CB371',
      shadowColor: '#98FB98',
      shadowOffset: { width: 4, height: 10 },
      shadowOpacity: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    register: {
      margin: 'auto',
      marginTop: 20,
      marginBottom: -90,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      color: '#3CB371',
    },
    registerLink: {
      color: '#3CB371',
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
});

export default LoginScreen;
