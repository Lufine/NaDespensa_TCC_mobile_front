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
      // Verificar se o usuário está autenticado
      const userId = await AsyncStorage.getItem('userId');

      // Verificar se as notificações estão habilitadas
      const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');

      if (userId && JSON.parse(notificationsEnabled)) {
        const isConfigured = await notificationService.configure();
        if (isConfigured) {
          console.log('Checking and sending immediate notifications.');
          await notificationService.checkAndSendNotifications();

          console.log('Scheduling notifications every 12 hours.');
          await notificationService.scheduleNotificationsEvery12Hours();
        }
      }
    };

    configureNotifications();
  }, []);

  return <StackNavigator />;
};

export default App;
