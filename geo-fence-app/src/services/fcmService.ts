import { getMessaging, onMessage as onFirebaseMessage } from 'firebase/messaging';
import { messaging } from '../firebase';

class FCMService {
  private static instance: FCMService;
  private messageHandlers: ((payload: any) => void)[] = [];

  private constructor() {
    if (messaging) {
      // Initialize message listener
      onFirebaseMessage(messaging, (payload) => {
        console.log('Received foreground message:', payload);
        this.messageHandlers.forEach(handler => handler(payload));
        
        // Show notification if app is in foreground
        if (Notification.permission === 'granted' && payload.notification) {
          const { title, body } = payload.notification;
          new Notification(title || 'New Message', {
            body: body || '',
            icon: '/firebase-logo.png'
          });
        }
      });
    }
  }

  public static getInstance(): FCMService {
    if (!FCMService.instance) {
      FCMService.instance = new FCMService();
    }
    return FCMService.instance;
  }

  public addMessageHandler(handler: (payload: any) => void) {
    this.messageHandlers.push(handler);
  }

  public removeMessageHandler(handler: (payload: any) => void) {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }
}

export default FCMService.getInstance(); 