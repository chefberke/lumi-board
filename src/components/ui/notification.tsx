"use client";

import React from "react";
import { Notification } from "@/services/notificationService";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  AlertCircle,
} from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-black" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-black" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-black" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
  };

  return (
    <div
      className={`mb-3 p-3 rounded-lg border ${
        notification.read ? "bg-gray-50" : "bg-white border-l-4 border-l-lumi"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="mt-1">{getIcon()}</div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{notification.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            <p className="text-xs text-gray-400 mt-2">
              {getTimeAgo(notification.date)}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {!notification.read && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1 text-gray-400 hover:text-primary"
              title="Okundu olarak işaretle"
            >
              <CheckCheck className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="p-1 text-gray-400 hover:text-red-500"
            title="Bildirimi sil"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-primary hover:underline"
            >
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-gray-500 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="h-10 w-10 mx-auto mb-2 text-gray-300" />
          <p>You have no notification yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
