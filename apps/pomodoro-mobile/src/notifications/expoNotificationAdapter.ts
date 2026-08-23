import * as Notifications from "expo-notifications";
import type { NotificationPort } from "@personal-platform/pomodoro-core";

/**
 * Configure how notifications appear when the app is in the foreground.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const expoNotificationAdapter: NotificationPort = {
  async scheduleCompletion(atTimestampMs) {
    // Cancel any previously scheduled notification first.
    await Notifications.cancelAllScheduledNotificationsAsync();

    const delaySec = Math.max(
      0,
      Math.floor((atTimestampMs - Date.now()) / 1000),
    );
    if (delaySec <= 0) return;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pomodoro",
        body: "Session complete",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delaySec,
      },
    });
    return id;
  },

  async cancelScheduled() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  isAvailable() {
    return true;
  },
};
