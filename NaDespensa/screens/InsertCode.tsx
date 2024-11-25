import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Image, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import axios from 'axios';

const InsertCode = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const { email } = route.params;

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Erro', 'Por favor, insira o código');
      return;
    }

    try {
      const response = await axios.post('http://192.168.24.5:3000/verify-reset-code', { email, code });

      if (response.data.success) {
        navigation.navigate('CreateNewPassword', { email, resetCode: code });
      } else {
        Alert.alert('Erro', 'Código inválido ou expirado');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao verificar o código. Tente novamente.');
      console.error(error);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await axios.post('http://192.168.24.5:3000/resend-reset-code', { email });
  
      if (response.data.success) {
        Alert.alert('Sucesso', 'Código reenviado para seu e-mail.');
      } else {
        Alert.alert('Erro', 'Não foi possível reenviar o código. Tente novamente.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao reenviar o código.');
      console.error(error);
    }
  };
  

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
}, [navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image style={styles.design} source={require('../assets/desingtopright.png')} />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.back} source={require('../assets/back.png')} />
          <Text style={styles.voltar}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Acabamos de enviar um código para seu e-mail</Text>
        <View style={styles.inputContainer}>
          <Image style={styles.icon} source={require('../assets/cadeado.png')} />
          <TextInput
            placeholder="Insira o código"
            value={code}
            onChangeText={setCode}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity onPress={handleResendCode}>
          <Text style={styles.resendLink}>Reenviar código</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
        <Image source={require('../assets/info.png')} style={styles.info} />
        <Text style={styles.resendText}>Se não encontrar o e-mail na sua caixa de entrada verifique a pasta de spam</Text>
        <Image style={styles.designunder} source={require('../assets/designunder.png')} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 220,
  },
  design: {
    width: 220,
    height: 200,
    position: 'absolute',
    right: "-10%",
    top: 0,
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
    fontSize: 24,
    color: '#3CB371',
    fontWeight: 'bold',
    marginTop: 50,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendLink: {
    fontSize: 14,
    color: '#1877F2',
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: -5,
    marginLeft: 10,
    marginBottom: 10,
  },
  info: {
    width: 20,
    height: 20,
    left: 10,
    top: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#3CB371',
    textAlign: 'center',
    marginTop: 0,
    marginLeft: 20,
  },
  designunder: {
    width: '115%',
    height: 210,
    position: 'absolute',
    bottom: -35,
    left: 0,
  },
});

export default InsertCode;
