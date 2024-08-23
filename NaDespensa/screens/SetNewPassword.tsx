import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import axios from 'axios';

const ChangePasswordScreen = ({ navigation, route }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  
    const { userId } = route.params; // Obtendo userId dos parâmetros de navegação
  
    useEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, [navigation]);
  
    const handleChangePassword = async () => {
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Erro', 'Todos os campos são obrigatórios');
        return;
      }
  
      if (newPassword !== confirmPassword) {
        Alert.alert('Erro', 'As novas senhas não coincidem');
        return;
      }
  
      try {
        const response = await axios.put(`http://192.168.24.17:3000/users/${userId}/change-password`, {
          oldPassword: currentPassword,
          newPassword: newPassword,
        });
  
        if (response.data.success) {
          Alert.alert('Sucesso', 'Senha alterada com sucesso');
          navigation.goBack();
        } else {
          Alert.alert('Erro', response.data.message || 'Não foi possível alterar a senha. Tente novamente.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível alterar a senha. Tente novamente.');
      }
    };
  
    const togglePasswordVisibility = (setPasswordVisible) => {
      setPasswordVisible(prevState => !prevState);
    };
  
    return (
      <ScrollView style={styles.container}>
        <Image style={styles.designTopRight} source={require('../assets/desingtopright.png')} />
        <View style={styles.container2}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image style={styles.backIcon} source={require('../assets/back.png')} />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Alterar senha</Text>
          <View style={styles.inputContainerAtual}>
            <Text style={styles.textContainer}>Insira sua senha atual</Text>
            <TextInput
              placeholder="Senha atual"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              style={styles.input}
              secureTextEntry={!isCurrentPasswordVisible}
            />
            <Image style={styles.icon} source={require('../assets/cadeado.png')} />
            <TouchableOpacity onPress={() => togglePasswordVisibility(setIsCurrentPasswordVisible)}>
              <Image
                style={styles.showIcon}
                source={isCurrentPasswordVisible ? require('../assets/hidepass.png') : require('../assets/showpass.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textContainer}>Insira sua nova senha</Text>
            <TextInput
              placeholder="Nova senha"
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
              secureTextEntry={!isNewPasswordVisible}
            />
            <Image style={styles.icon} source={require('../assets/cadeado.png')} />
            <TouchableOpacity onPress={() => togglePasswordVisibility(setIsNewPasswordVisible)}>
              <Image
                style={styles.showIcon}
                source={isNewPasswordVisible ? require('../assets/hidepass.png') : require('../assets/showpass.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textContainer}>Insira sua nova senha novamente</Text>
            <TextInput
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              secureTextEntry={!isConfirmPasswordVisible}
            />
            <Image style={styles.icon} source={require('../assets/cadeado.png')} />
            <TouchableOpacity onPress={() => togglePasswordVisibility(setIsConfirmPasswordVisible)}>
              <Image
                style={styles.showIcon}
                source={isConfirmPasswordVisible ? require('../assets/hidepass.png') : require('../assets/showpass.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordInfoContainer}>
            <Image style={styles.iconInfo} source={require('../assets/info.png')} />
            <Text style={styles.passwordInfoTitle}>Para uma senha forte:</Text>
          </View>
          <Text style={styles.passwordInfo}>
            {'\n'}• Senha deve ter 8 caracteres;
            {'\n'}• Conter pelo menos 1 (um) número;
            {'\n'}• Conter pelo menos 1 (uma) letra maiúscula;
            {'\n'}• Conter pelo menos 1 (uma) letra minúscula;
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  designTopRight: {
    width: 220,
    height: 200,
    position: 'absolute',
    right: "-10%",
    top: 0,
  },
  container2: {
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  backText: {
    color: '#3CB371',
    fontSize: 16,
    marginLeft: 10,
  },
  title: {
    fontSize: 30,
    color: '#3CB371',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  textContainer:{
    fontSize: 16,
    color: '#3CB371',
    marginBottom: 15,
  },
  inputContainerAtual:{
    position: 'relative',
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
    transform: [{ translateY: 10 }],
  },
  showIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -32.5 }],
  },
  passwordInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  iconInfo: {
    width: 20,
    height: 20,
  },
  passwordInfoTitle: {
    color: '#3CB371',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  passwordInfo: {
    color: 'red',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    width: '48%',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#3CB371',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    width: '48%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
