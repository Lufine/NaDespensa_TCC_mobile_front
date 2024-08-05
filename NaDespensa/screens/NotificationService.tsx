import * as Notifications from 'expo-notifications';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  configure = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    console.log('Notification permissions granted.');
    return true;
  };

  checkAndSendNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await axios.get(`http://192.168.24.17:3000/pre-expiry-products/${userId}`);
        const products = response.data;

        products.forEach(product => {
          const expiryDate = new Date(product.expiry_date);
          const currentDate = new Date();
          const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));

          if (daysLeft <= 5) {
            console.log(`Notifying about ${product.name} expiring in ${daysLeft} days.`);
            Notifications.scheduleNotificationAsync({
              content: {
                title: "Produto Próximo do Vencimento",
                body: `${product.name} está vencendo em ${daysLeft} dias!`,
              },
              trigger: {hour: 1}, // Notificação imediata
            });
          }
        });

        // Agendar notificação a cada 12 horas
        await this.scheduleNotificationsEvery12Hours();
      }
    } catch (error) {
      console.error('Erro ao buscar produtos próximos ao vencimento:', error);
    }
  };

  scheduleNotificationsEvery12Hours = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync(); // Cancelar notificações agendadas anteriormente
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Itens na Despensa",
          body: "Verifique os itens na sua despensa. Use nossa sugestão de receitas!",
        },
        trigger: {
          hour: 0, // Primeiro disparo após 12 horas
          minute: 0,
          repeats: true,
        },
      });
      console.log('Notification scheduled every 12 hours.');
    } catch (error) {
      console.error('Erro ao agendar notificações de 12 horas:', error);
    }
  };

  scheduleTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Teste de Notificação",
          body: "Esta é uma notificação de teste.",
        },
        trigger: { seconds: 5 },
      });
      console.log('Test notification scheduled.');
    } catch (error) {
      console.error('Erro ao agendar notificação de teste:', error);
    }
  };
}

const notificationService = new NotificationService();
export default notificationService;
