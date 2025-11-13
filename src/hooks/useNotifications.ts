import { useCallback, useEffect, useState } from "react";

import { fetchNotifications, markNotificationRead, type Notification } from "@/lib/api";
import { useAuth } from "./useAuth";

export function useNotifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const items = await fetchNotifications(token);
      setNotifications(items);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    void loadNotifications();
  }, [token, loadNotifications]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const markRead = useCallback(
    async (id: string) => {
      if (!token) return;
      await markNotificationRead(id, token);
      setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
    },
    [token]
  );

  return {
    notifications,
    unreadCount,
    loading,
    reload: loadNotifications,
    markRead
  };
}
