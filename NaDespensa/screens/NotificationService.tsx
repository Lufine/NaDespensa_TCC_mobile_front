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

        products.forEach(async (product) => {
          const expiryDate = new Date(product.expiry_date);
          const currentDate = new Date();
          const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));

          if (daysLeft <= 5) {
            console.log(`Notifying about ${product.name} expiring in ${daysLeft} days.`);
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Produto Próximo do Vencimento",
                body: `${product.name} está vencendo em ${daysLeft} dias!`,
              },
              trigger: {
                seconds: 1, // Notificação imediata para teste
              },
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

      const randomMinutes = Math.floor(Math.random() * 720); // Aleatório entre 0 e 720 minutos (12 horas)
      const triggerTime = new Date();
      triggerTime.setMinutes(triggerTime.getMinutes() + randomMinutes);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Itens na Despensa",
          body: "Verifique os itens na sua despensa. Use nossa sugestão de receitas!",
        },
        trigger: {
          hour: triggerTime.getHours(),
          minute: triggerTime.getMinutes(),
          repeats: true,
        },
      });
      console.log('Notification scheduled every 12 hours with random time.');
    } catch (error) {
      console.error('Erro ao agendar notificações de 12 horas:', error);
    }
  };

  scheduleTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Teste de Notificação",
          body: "Esta é uma notificação de teste para verificar o envio.",
        },
        trigger: { seconds: 5 }, // Notificação imediata para teste
      });
      console.log('Test notification scheduled.');
    } catch (error) {
      console.error('Erro ao agendar notificação de teste:', error);
    }
  };

  // Função para cancelar todas as notificações
  cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications have been canceled.');
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
    }
  };
}

const notificationService = new NotificationService();
export default notificationService;
