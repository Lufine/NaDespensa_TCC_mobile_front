import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import axios from 'axios';

// Função de validação de telefone no formato (XX) XXXXX-XXXX
const isValidPhoneNumber = (phoneNumber) => {
  const regex = /^\d{11}$/; // Modificar para o formato desejado se necessário
  return regex.test(phoneNumber);
};

const ChangePhoneNumberScreen = ({ navigation, route }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [confirmPhoneNumber, setConfirmPhoneNumber] = useState('');
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);

    const { userId } = route.params;

    useEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, [navigation]);

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

    const handleChangePhoneNumber = async () => {
      if (!currentPassword || !newPhoneNumber || !confirmPhoneNumber) {
        Alert.alert('Erro', 'Todos os campos são obrigatórios');
        return;
      }

      if (newPhoneNumber !== confirmPhoneNumber) {
        Alert.alert('Erro', 'Os novos números de telefone não coincidem');
        return;
      }

      if (!isValidPhoneNumber(newPhoneNumber)) {
        Alert.alert('Erro', 'Número de telefone inválido. Deve ter 11 dígitos.');
        return;
      }

      try {
        const response = await axios.put(`http://192.168.24.17:3000/users/${userId}/change-phone-number`, {
          currentPassword,
          newPhoneNumber,
        });

        if (response.data.success) {
          Alert.alert('Sucesso', 'Número de telefone alterado com sucesso');
          navigation.goBack();
        } else {
          Alert.alert('Erro', response.data.message || 'Não foi possível alterar o número de telefone. Tente novamente.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível alterar o número de telefone. Tente novamente.');
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
          <Text style={styles.title}>Alterar número de telefone</Text>
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
            <Text style={styles.textContainer}>Insira seu novo número de telefone</Text>
            <TextInput
              placeholder="Novo número de telefone"
              value={newPhoneNumber}
              onChangeText={(text) => setNewPhoneNumber(formatPhone(text))}
              style={styles.input}
              keyboardType="number-pad"
            />
            <Image style={styles.icon} source={require('../assets/phone.png')} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textContainer}>Confirme seu novo número de telefone</Text>
            <TextInput
              placeholder="Confirmar novo número de telefone"
              value={confirmPhoneNumber}
              onChangeText={(text) => setConfirmPhoneNumber(formatPhone(text))}
              style={styles.input}
              keyboardType="number-pad"
            />
            <Image style={styles.icon} source={require('../assets/phone.png')} />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleChangePhoneNumber}>
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

export default ChangePhoneNumberScreen;
