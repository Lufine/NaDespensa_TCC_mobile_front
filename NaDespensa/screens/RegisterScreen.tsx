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

  // Função de validação do nome de usuário
  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      Alert.alert('Erro', 'Nome de usuário deve ter pelo menos 3 caracteres.');
      return false;
    }

    try {
      const response = await axios.post('http://192.168.24.5:3000/check-username', { nome: username });
      return response.data.isAvailable;
    } catch (error) {
      console.error('Error checking username:', error);
      Alert.alert('Erro', 'Erro ao verificar nome de usuário. Por favor, tente novamente.');
      return false; // Retornar falso se houver um erro
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex simples para validar e-mail
    return re.test(String(email).toLowerCase());
  };

  const formatDate = (text) => {
    // Remove tudo que não for número
    let cleaned = text.replace(/\D/g, '');
    
    // Se o usuário está deletando (string vazia ou com menos de 2 caracteres), apenas retorna o texto limpo
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 2) return cleaned;
    
    // Adiciona barras (/) automaticamente conforme o usuário digita
    if (cleaned.length <= 4) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
  };

  const formatPhone = (text) => {
    // Remove tudo que não for número
    let cleaned = text.replace(/\D/g, '');
  
    // Se o usuário está deletando (string vazia ou com menos de 2 caracteres), apenas retorna o texto limpo
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 2) return `(${cleaned}`;
  
    // Adiciona parênteses e hífen automaticamente conforme o usuário digita
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  
    // Limite o número de caracteres ao padrão de telefone
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  // Função de validação de data de nascimento
  const isValidDateOfBirth = (date) => {
    const regex = /^\d{2}[-/]\d{2}[-/]\d{4}$/; // Formato esperado DD-MM-AAAA ou DD/MM/AAAA
    if (!regex.test(date)) return false;

    const [day, month, year] = date.split(/[-/]/).map(Number);
    const dateObj = new Date(year, month - 1, day);
    if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) return false;

    const currentDate = new Date();
    const minDate = new Date();
    minDate.setFullYear(currentDate.getFullYear() - 120); // Máximo de 120 anos atrás
    const maxDate = new Date();
    maxDate.setFullYear(currentDate.getFullYear() - 13); // No mínimo 13 anos de idade

    return dateObj >= minDate && dateObj <= maxDate;
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumber && hasMinLength;
  };

  const handleRegister = async () => {
    if (!nome || !email || !dataNascimento || !telefone || !senha) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    if (!formatPhone(telefone)) {
      Alert.alert('Erro', 'O telefone deve estar no formato (XX) XXXXX-XXXX');
      return;
    }

    if (!isValidDateOfBirth(dataNascimento)) {
      Alert.alert('Erro', 'Data de nascimento inválida. Use o formato DD-MM-AAAA ou DD/MM/AAAA.');
      return;
    }

    if (!validatePassword(senha)) {
      Alert.alert(
        'Erro na Senha',
        'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula e um número.'
      );
      return;
    }

    const isUsernameAvailable = await checkUsernameAvailability(nome);
    if (!isUsernameAvailable) {
      Alert.alert('Erro', 'Nome de usuário já existe ou é inválido. Por favor, escolha outro.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.24.5:3000/register', {
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
      Alert.alert('Erro', 'Ocorreu um erro ao registrar. Por favor, tente novamente.');
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <ScrollView style={styles.container}>
      <Image style={styles.design} source={require('../assets/desingtopright.png')} />
      <View style={styles.container2}>
        <View style={styles.Buttonback}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.back} source={require('../assets/back.png')} />
            <Text style={styles.voltar}>Voltar</Text>
          </TouchableOpacity>
        </View>
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
            keyboardType="email-address"
          />
          <Image style={styles.icon} source={require('../assets/email.png')} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Data de nascimento"
            value={dataNascimento}
            onChangeText={(text) => setDataNascimento(formatDate(text))}
            keyboardType="number-pad"
            style={styles.input}
          />
          <Image style={styles.icon} source={require('../assets/calendar.png')} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Telefone"
            value={telefone}
            onChangeText={(text) => setTelefone(formatPhone(text))}
            keyboardType="number-pad"
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
          {'\n'}• Conter pelo menos 1 (uma) letra minúscula.
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  design: {
    width: 220,
    height: 200,
    position: 'absolute',
    right: "-10%",
    top: 0,
},
  container2:{
    padding: 20,
  },
  Buttonback:{
    width: '30%',
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
    marginRight: 30,
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
