import type { NotificationPort } from "@personal-platform/pomodoro-core";

let nextId = 0;
let activeTimeout: ReturnType<typeof setTimeout> | null = null;

function cancelActive() {
  if (activeTimeout !== null) {
    clearTimeout(activeTimeout);
    activeTimeout = null;
  }
}

export const webNotificationAdapter: NotificationPort = {
  async scheduleCompletion(atTimestampMs) {
    cancelActive();

    const delay = atTimestampMs - Date.now();
    if (delay <= 0) return;

    const id = String(++nextId);

    activeTimeout = setTimeout(() => {
      activeTimeout = null;
      if (typeof Notification === "undefined") return;
      if (Notification.permission === "granted") {
        new Notification("Pomodoro", {
          body: "Session complete",
          icon: "/favicon.ico",
        });
      }
    }, delay);

    return id;
  },

  async cancelScheduled() {
    cancelActive();
  },

  isAvailable() {
    return typeof Notification !== "undefined";
  },
};
