import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const CreateNewPassword = ({ navigation, route }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
//   const { email } = route.params; // Email do usuário passado via navegação

const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      const response = await axios.post('http://192.168.77.54:3000/reset-password', {
        email,
        newPassword
      });

      if (response.data.success) {
        Alert.alert('Sucesso', 'Senha alterada com sucesso');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', 'Não foi possível alterar a senha. Tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro. Tente novamente.');
    }
  };
  
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <ScrollView style={styles.container}>
      <Image style={styles.design} source={require('../assets/desingtopright.png')} />
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.back} source={require('../assets/back.png')} />
            <Text style={styles.voltar}>Voltar</Text>
        </TouchableOpacity>
      <Text style={styles.title}>Crie uma nova senha</Text>
      <View style={styles.inputContainer}>
          <TextInput
            placeholder="Senha"
            value={newPassword}
            onChangeText={setNewPassword}
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
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Confirme a nova senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry={!isConfirmPasswordVisible}
        />
        <Image style={styles.userLogo} source={require('../assets/cadeado.png')} />
          <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
            <Image
              style={styles.userLogoShow}
              source={isConfirmPasswordVisible ? require('../assets/hidepass.png') : require('../assets/showpass.png')}
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
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
      <View>
          <Image style={styles.iconInfo} source={require('../assets/info.png')} />
          <Text style={styles.passwordInfoTitle}>
            É necessário que todos os dispositivos acessem sua conta com a nova senha.
          </Text>
      </View>
      <Image style={styles.designunder} source={require('../assets/designunder.png')} />
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
        marginBottom: 30,
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
    inputContainer: {
        position: 'relative',
        marginBottom: 15,
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
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 40,
        borderColor: '#3CB371',
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
    designunder: {
        width: '120%',
        height: '40%',
        position: 'relative',
        bottom: '-20%',        
        left: '-10%',
        display: 'flex',
    },
});

export default CreateNewPassword;
