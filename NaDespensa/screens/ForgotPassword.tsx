import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Button } from 'react-native';
import axios from 'axios';

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
  
    const handleForgotPassword = async () => {
      if (!email) {
        Alert.alert('Erro', 'Por favor, insira seu email');
        return;
      }
  
      try {
        const response = await axios.post('http://192.168.77.45:3000/forgot-password', { email });
  
        if (response.data.success) {
          Alert.alert('Sucesso', 'Instruções para redefinir a senha foram enviadas para seu email');
          navigation.goBack();
        } else {
          Alert.alert('Erro', 'Não foi possível enviar as instruções. Tente novamente.');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          Alert.alert('Erro', 'Nenhum usuário com o email informado encontrado');
        } else {
          Alert.alert('Erro', 'Ocorreu um erro. Tente novamente.');
        }
        console.error(error);
      }
    };

    useEffect(() => {
        navigation.setOptions({
          headerShown: false,
        });
      }, [navigation]);
  
    return (
      <ScrollView style={styles.container}>
        <Image style={styles.design} source={require('../assets/desingtopright.png')} />
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.back} source={require('../assets/back.png')} />
            <Text style={styles.voltar}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Esqueceu a senha?</Text>
        <Text style={styles.subtitle}>Redefina a senha em duas etapas</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <Image style={styles.icon} source={require('../assets/email.png')} />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
        <Image style={styles.designunder} source={require('../assets/designunder.png')} />
        <Button title="TESTE TELA SENHA" onPress={() => navigation.navigate('CreateNewPassword')} />
      </ScrollView>     
    );
  };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    design: {
        width: 180,
        height: 160,
        position: 'absolute',
        right: -20,
        top: -20,
    },
    back: {
        width: 20,
        height: 20,
        marginTop: 50,
        marginBottom: 10,
    },
    voltar: {
        color: '#3CB371',
        fontSize: 16,
        marginTop: -30,
        marginLeft: 20,
        marginBottom: 30,
    },
    title: {
        fontSize: 30,
        color: '#3CB371',
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#3CB371',
        marginBottom: 20,
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#3CB371',
        borderRadius: 5,
        padding: 10,
        paddingLeft: 40,
        fontSize: 16,
    },
    icon: {
        width: 20,
        height: 20,
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    button: {
        backgroundColor: '#3CB371',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    designunder: {
        width: '120%',
        height: '55%',
        position: 'relative',
        bottom: '-60%',        
        left: '-10%',
        display: 'flex',
    },
});

export default ForgotPassword;
