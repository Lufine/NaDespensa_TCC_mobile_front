import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import axios from 'axios';

const ChangeEmailScreen = ({ navigation, route }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);

    const { userId } = route.params;

    useEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, [navigation]);

    const handleChangeEmail = async () => {
      if (!currentPassword || !newEmail || !confirmEmail) {
        Alert.alert('Erro', 'Todos os campos são obrigatórios');
        return;
      }

      if (newEmail !== confirmEmail) {
        Alert.alert('Erro', 'Os novos e-mails não coincidem');
        return;
      }

      try {
        const response = await axios.put(`http://192.168.24.17:3000/users/${userId}/change-email`, {
          currentPassword,
          newEmail,
        });

        if (response.data.success) {
          Alert.alert('Sucesso', 'E-mail alterado com sucesso');
          navigation.goBack();
        } else {
          Alert.alert('Erro', response.data.message || 'Não foi possível alterar o e-mail. Tente novamente.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível alterar o e-mail. Tente novamente.');
      }
    };

    const togglePasswordVisibility = () => {
      setIsCurrentPasswordVisible(prevState => !prevState);
    };

    return (
      <ScrollView style={styles.container}>
        <Image style={styles.designTopRight} source={require('../assets/desingtopright.png')} />
        <View style={styles.container2}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image style={styles.backIcon} source={require('../assets/back.png')} />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Alterar e-mail</Text>
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
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Image
                style={styles.showIcon}
                source={isCurrentPasswordVisible ? require('../assets/hidepass.png') : require('../assets/showpass.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textContainer}>Insira seu novo e-mail</Text>
            <TextInput
              placeholder="Novo e-mail"
              value={newEmail}
              onChangeText={setNewEmail}
              style={styles.input}
            />
            <Image style={styles.icon} source={require('../assets/email.png')} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textContainer}>Confirme seu novo e-mail</Text>
            <TextInput
              placeholder="Confirmar novo e-mail"
              value={confirmEmail}
              onChangeText={setConfirmEmail}
              style={styles.input}
            />
            <Image style={styles.icon} source={require('../assets/email.png')} />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleChangeEmail}>
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

export default ChangeEmailScreen;
