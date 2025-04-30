"use client";

import React, { useEffect, useState } from "react";
import { NotificationList } from "@/components/ui/notification";
import { getAllWorkspacesWithTasks } from "@/services/workspaceService";
import { KanbanWorkspace } from "@/stores/kanbanStore";
import {
  Notification,
  checkTasksForNotifications,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} from "@/services/notificationService";

export default function InboxPage() {
  const [workspaces, setWorkspaces] = useState<KanbanWorkspace[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        setLoading(true);
        const data = await getAllWorkspacesWithTasks();
        setWorkspaces(data);
        setError(null);
      } catch (err) {
        console.error("Error loading workspaces:", err);
        setError(
          "There was an error loading the data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (workspaces.length > 0) {
      const updatedNotifications = checkTasksForNotifications(workspaces);
      setNotifications(updatedNotifications);
    } else {
      setNotifications(getNotifications());
    }
  }, [workspaces]);

  const handleMarkAsRead = (id: string) => {
    const updated = markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteNotification(id);
    setNotifications(updated);
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setNotifications([]);
  };

  return (
    <div className="h-full w-full">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 rounded-md bg-red-50">{error}</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm w-full">
          <NotificationList
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDelete={handleDelete}
            onClearAll={handleClearAll}
          />
        </div>
      )}
    </div>
  );
}
