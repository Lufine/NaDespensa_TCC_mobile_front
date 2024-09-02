import React, { useEffect } from 'react';
import StackNavigator from './navigation/StackNavigator';
import notificationService from './screens/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App: React.FC = () => {
  useEffect(() => {
    const configureNotifications = async () => {
      try {
        // Verificar se o usuário está autenticado
        const userId = await AsyncStorage.getItem('userId');
        // Verificar se as notificações estão habilitadas
        const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');

        if (userId && JSON.parse(notificationsEnabled)) {
          const isConfigured = await notificationService.configure();
          if (isConfigured) {
            await notificationService.checkAndSendNotifications();

            await notificationService.scheduleRandomNotifications(); // Agendar notificações em horários aleatórios
          }
        }
      } catch (error) {
        console.error('Erro ao configurar notificações:', error);
      }
    };

    configureNotifications();
  }, []);

  return <StackNavigator />;
};

export default App;
