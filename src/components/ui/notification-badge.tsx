"use client";

import React, { useEffect, useState } from "react";
import { getNotifications } from "@/services/notificationService";
import { useRouter } from "next/navigation";

export const NotificationBadge: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkNotifications = () => {
      const notifications = getNotifications();
      const unread = notifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    };

    checkNotifications();

    const interval = setInterval(checkNotifications, 60000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "notifications") {
        checkNotifications();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="inline-flex ml-1">
      {unreadCount > 0 && (
        <span className="bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );
};
