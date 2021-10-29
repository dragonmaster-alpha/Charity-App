import firebase from 'react-native-firebase';
import { Platform } from 'react-native';

const CHANNEL_ID = 'channel';
const channel = new firebase.notifications.Android.Channel(
  CHANNEL_ID,
  'Notifications channel',
  firebase.notifications.Android.Importance.Max,
)
  .setDescription('Notifications channel')
  .setSound('default');
firebase.notifications().android.createChannel(channel);

let notificationListener: { (): void; (): any };
let notificationOpenedListener: { (): void; (): any };

export const setNotificationsListeners = () => {
  notificationListener = firebase.notifications().onNotification(notification => {
    if (Platform.OS === 'android') {
      notification
        .setSound('default')
        .android.setChannelId(CHANNEL_ID)
        .android.setSmallIcon('@drawable/ic_notification')
        .android.setColor('#3059A0')
        .android.setPriority(firebase.notifications.Android.Priority.High);

      firebase.notifications().displayNotification(notification);
    } else if (Platform.OS === 'ios') {
      notification
        .setNotificationId(notification.notificationId)
        .setSound('default')
        .setTitle(notification.title)
        .setSubtitle(notification.subtitle)
        .setBody(notification.body)
        .setData(notification.data)
        .ios.setBadge(notification.ios.badge);

      firebase
        .notifications()
        .displayNotification(notification)
        // eslint-disable-next-line no-console
        .catch(err => console.error(err));
    }
  });

  notificationOpenedListener = firebase.notifications().onNotificationOpened(({ notification }) => {
    firebase.notifications().removeDeliveredNotification(notification.notificationId);
  });
};

export const resetNotificationsListeners = () => {
  notificationListener();
  notificationOpenedListener();
};
