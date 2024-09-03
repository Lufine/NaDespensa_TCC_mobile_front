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
      console.log('Permissão de notificações não concedida.');
      return false;
    }

    console.log('Notificações foram permitidas.');
    return true;
  };

  scheduleImmediateNotification = async () => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Notificação Ativada",
          body: "As notificações foram ativadas com sucesso!",
        },
        trigger: {
          seconds: 1, // Notificação imediata
        },
      });

      console.log(`Notificação imediata agendada. ID: ${notificationId}`);
    } catch (error) {
      console.error('Erro ao agendar notificação imediata:', error);
    }
  };

  checkAndSendNotifications = async () => {
    try {
      const lastNotificationDate = await AsyncStorage.getItem('lastNotificationDate');
      const currentDate = new Date().toISOString().split('T')[0];
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        console.log('Nenhum usuário logado.');
        return;
      }

      if (lastNotificationDate === currentDate) {
        console.log(`Notificações já foram agendadas hoje para o usuário: ${userId}`);
        return;
      }

      // Buscar produtos próximos ao vencimento para o usuário específico
      const response = await axios.get(`http://192.168.24.17:3000/pre-expiry-products/${userId}`);
      console.log(`Resposta do servidor para o usuário ${userId}:`, response.data);
      const products = response.data;

      const expiringProducts = products.filter(product => {
        const expiryDate = new Date(product.expiry_date);
        const now = new Date();
        const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        return daysLeft <= 5;
      });

      console.log('Produtos próximos ao vencimento:', expiringProducts);

      if (expiringProducts.length > 0) {
        console.log('Notificação sobre produtos próximos ao vencimento.');
        await this.scheduleExpiringProductsNotifications();
      }

      // Atualiza a data da última notificação para hoje
      await AsyncStorage.setItem('lastNotificationDate', currentDate);
    } catch (error) {
      console.error('Erro ao buscar produtos próximos ao vencimento:', error);
    }
  };

  scheduleRandomNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.log('Nenhum usuário logado.');
        return;
      }

      const intervals = [
        { startHour: 7, startMinute: 0, endHour: 8, endMinute: 0 },     // Café da manhã
        { startHour: 11, startMinute: 30, endHour: 12, endMinute: 30 }, // Almoço
        { startHour: 18, startMinute: 0, endHour: 19, endMinute: 0 }    // Janta
      ];

      for (const interval of intervals) {
        const randomTime = this.getRandomTime(interval.startHour, interval.startMinute, interval.endHour, interval.endMinute);

        const formattedHour = String(randomTime.hour).padStart(2, '0');
        const formattedMinute = String(randomTime.minute).padStart(2, '0');

        console.log(`Notificações aleatórias serão enviadas ${formattedHour}:${formattedMinute}`);
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Itens na Despensa",
            body: "Verifique os itens na sua despensa. Use nossa sugestão de receitas!",
          },
          trigger: {
            hour: randomTime.hour,
            minute: randomTime.minute,
            repeats: true,
          },
        });
      }

      console.log('Notificações aleatórias agendadas dentro dos intervalos específicos.');
    } catch (error) {
      console.error('Erro ao agendar notificações aleatórias:', error);
    }
  };

  scheduleExpiringProductsNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.log('Nenhum usuário logado.');
        return;
      }

      const intervals = [
        { startHour: 7, startMinute: 0, endHour: 8, endMinute: 0 },     // Café da manhã
        { startHour: 11, startMinute: 30, endHour: 12, endMinute: 30 }, // Almoço
        { startHour: 18, startMinute: 0, endHour: 19, endMinute: 0 }    // Janta
      ];

      for (const interval of intervals) {
        const randomTime = this.getRandomTime(interval.startHour, interval.startMinute, interval.endHour, interval.endMinute);

        const formattedHour = String(randomTime.hour).padStart(2, '0');
        const formattedMinute = String(randomTime.minute).padStart(2, '0');

        console.log(`Notificações sobre produtos próximos ao vencimento serão enviadas ${formattedHour}:${formattedMinute}`);
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Produto Próximo do Vencimento",
            body: "Você tem produtos próximos do vencimento. Verifique sua despensa!",
          },
          trigger: {
            hour: randomTime.hour,
            minute: randomTime.minute,
            repeats: true,
          },
        });
      }

      console.log('Notificações sobre produtos próximos ao vencimento agendadas dentro dos intervalos específicos.');
    } catch (error) {
      console.error('Erro ao agendar notificações sobre produtos próximos ao vencimento:', error);
    }
  };

  getRandomTime = (startHour, startMinute, endHour, endMinute) => {
    const start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    const randomTime = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

    return {
      hour: randomTime.getHours(),
      minute: randomTime.getMinutes()
    };
  };

  cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Todas as notificações foram canceladas.');
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
    }
  };
}

  // scheduleTestNotification = async () => {
  //   try {
  //     const notificationId = await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: "Teste de Notificação",
  //         body: "Esta é uma notificação de teste para verificar o envio.",
  //       },
  //       trigger: { seconds: 5 }, // Notificação imediata para teste
  //     });
  //     console.log('Test notification scheduled.');
  //     console.log(`Test notification ID: ${notificationId}`);
  //   } catch (error) {
  //     console.error('Erro ao agendar notificação de teste:', error);
  //   }
  // };

  const notificationService = new NotificationService();
  export default notificationService;
  