import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleRegister = async () => {
    if (!nome || !email || !dataNascimento || !telefone || !senha) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    try {
      const response = await axios.post('http://192.168.77.54:3000/register', {
        nome,
        email,
        dataNascimento,
        telefone,
        senha,
      });

      if (response.data.success) {
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', 'Não foi possível registrar. Tente novamente.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <ScrollView style={styles.container}>
      <Image style={styles.design} source={require('../assets/desingtopright.png')} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image style={styles.back} source={require('../assets/back.png')} />
        <Text style={styles.voltar}>Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Inscrever-se</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <Image style={styles.icon} source={require('../assets/user.png')} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <Image style={styles.icon} source={require('../assets/email.png')} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Data de nascimento"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          style={styles.input}
        />
        <Image style={styles.icon} source={require('../assets/calendar.png')} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          style={styles.input}
        />
        <Image style={styles.icon} source={require('../assets/phone.png')} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry={!isPasswordVisible}
        />
        <Image style={styles.icon} source={require('../assets/cadeado.png')} />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Image
            style={styles.showIcon}
            source={isPasswordVisible ? require('../assets/hidepass.png') : require('../assets/showpass.png')}
          />
        </TouchableOpacity>
      </View>
      <View>
        <Image style={styles.iconInfo} source={require('../assets/info.png')} />
        <Text style={styles.passwordInfoTitle}>Para uma senha forte:</Text>
      </View>
      <Text style={styles.passwordInfo}>
        {'\n'}• Senha deve ter no mínimo 8 caracteres;
        {'\n'}• Conter pelo menos 1 (um) número;
        {'\n'}• Conter pelo menos 1 (uma) letra maiúscula;
        {'\n'}• Conter pelo menos 1 (uma) letra minúscula;
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <Text style={styles.loginLink}>
        Já tem uma conta?{' '}
        <Text style={styles.loginLinkText} onPress={() => navigation.navigate('Login')}>
          Entre
        </Text>
      </Text>
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
    marginBottom: 30,
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
  showIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -30 }],
  },
  iconInfo: {
    width: 20,
    height: 20,
    position: 'absolute',
    left: 10,
    top: 20,
    transform: [{ translateY: -10 }],
  },
  passwordInfoTitle: {
    color: '#3CB371',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginLeft: 35,
  },
  passwordInfo: {
    color: 'red',
    marginTop: 0,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3CB371',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    textAlign: 'center',
    color: '#3CB371',
    fontSize: 16,
  },
  loginLinkText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
