import { useEffect, useRef } from "react";
import type { NotificationPort } from "@personal-platform/pomodoro-core";
import { expoNotificationAdapter } from "../notifications/expoNotificationAdapter";

/**
 * Schedules a local notification for when the current session completes, and
 * cancels it when the timer pauses, resets, or unmounts.
 */
export function useNotifications(
  isRunning: boolean,
  remainingSeconds: number,
  port: NotificationPort = expoNotificationAdapter,
) {
  const notificationIdRef = useRef<string | void>(undefined);

  useEffect(() => {
    if (!port.isAvailable()) return;

    if (isRunning && remainingSeconds > 0) {
      const at = Date.now() + remainingSeconds * 1000;
      port.scheduleCompletion(at).then((id) => {
        notificationIdRef.current = id;
      });
    } else {
      port.cancelScheduled(notificationIdRef.current);
      notificationIdRef.current = undefined;
    }

    return () => {
      port.cancelScheduled(notificationIdRef.current);
      notificationIdRef.current = undefined;
    };
  }, [isRunning, remainingSeconds, port]);
}
