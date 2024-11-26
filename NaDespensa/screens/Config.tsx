import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationFooter from './FooterConfig';
import notificationService from './NotificationService'; // Certifique-se de ajustar o caminho
import { useFocusEffect } from '@react-navigation/native';

const SettingsScreen = ({ route, navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  const { userId } = route.params;

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
        setIsEnabled(notificationsEnabled === 'true');
      } catch (error) {
        console.error('Erro ao carregar configurações de notificações:', error);
      }
    };

    loadSettings();
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleNavigate = (screen) => {
    navigation.navigate(screen, { userId });
  };

  const toggleSwitch = () => {
    Alert.alert(
      "Confirmação",
      `Você deseja ${isEnabled ? 'desativar' : 'ativar'} as notificações?`,
      [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: async () => {
            const newValue = !isEnabled;
            setIsEnabled(newValue);
            try {
              await AsyncStorage.setItem('notificationsEnabled', newValue.toString());
              if (newValue) {
                console.log('Habilitando notificações...');
                await notificationService.configure();
                await notificationService.checkAndSendNotifications(); // Enviar notificações sobre produtos próximos ao vencimento
                await notificationService.scheduleImmediateNotification(); // Enviar notificação de teste
                await notificationService.scheduleRandomNotifications();
              } else {
                console.log('Desabilitando notificações...');
                await notificationService.cancelAllNotifications(); // Cancelar todas as notificações
              }
            } catch (error) {
              console.error('Erro ao salvar configurações de notificações:', error);
            }
          },
        },
      ]
    );
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://192.168.24.5:3000/users/${userId}`);
      const { nome, email, telefone } = response.data;
      setUserData({
        nome,
        email,
        telefone,
      });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.design} source={require('../assets/desingtopright.png')} />
      <TouchableOpacity onPress={() => navigation.goBack()}style={styles.backContainer}>
        <Image style={styles.back} source={require('../assets/back.png')} />
        <Text style={styles.voltar}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Configurações</Text>

      <Image style={styles.image} source={require('../assets/imageconfig.png')} />

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.sectionnotification}>
          <Image style={styles.iconnotification} source={require('../assets/notificationconfig.png')} />
          <Text style={styles.sectionTitle}>Notificações</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#3CB371" }}
            thumbColor={isEnabled ? "#ffffff" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
              style={{alignSelf: 'flex-end',}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Informações da conta</Text>

          <TouchableOpacity style={styles.infoItem} onPress={() => handleNavigate('SetNewName')}>
            <Image style={styles.icon} source={require('../assets/profileconfig.png')} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Nome</Text>
              <Text style={styles.infoValue}>{userData.nome}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem} onPress={() => handleNavigate('SetNewEmail')}>
            <Image style={styles.icon} source={require('../assets/emailconfig.png')} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Email</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}  onPress={() => handleNavigate('SetNewPhone')}>
            <Image style={styles.icon} source={require('../assets/phoneconfig.png')} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Telefone</Text>
              <Text style={styles.infoValue}>{userData.telefone}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem} onPress={() => handleNavigate('SetNewPassword')}>
            <Image style={styles.icon} source={require('../assets/passwordconfig.png')} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Senha</Text>
              <Text style={styles.infoValue}>Alterar Senha</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <NavigationFooter handleNavigate={handleNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  design: {
    width: 220,
    height: 200,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 80, // Espaçamento adicional para garantir que o conteúdo não seja oculto pelo footer
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: '15%',
    marginBottom: '5%',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3CB371',
    marginTop: 10,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 20,
  },
  sectionnotification:{
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#BEBAB3',
    padding: 10,
    borderRadius: 15,
  },
  iconnotification:{
    margin: 'auto',
    right: 40,
    width: 30,
    height: 30,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    alignItems: 'flex-start',
    fontWeight: 'bold',
    color: '#3CB371',
    margin: 'auto',
    right: 80,
    marginLeft: 10,
  },
  sectionHeader: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3CB371',
  },
  infoValue: {
    fontSize: 14,
    color: '#777',
  },
});

export default SettingsScreen;
