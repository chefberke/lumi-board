import { KanbanWorkspace } from "@/stores/kanbanStore";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'error';
  date: Date;
  taskId?: string;
  read: boolean;
}

export const createNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>): Notification => {
  return {
    ...notification,
    id: Math.random().toString(36).substring(2, 9),
    date: new Date(),
    read: false
  };
};

export const getNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return [];

  const storedNotifications = localStorage.getItem('notifications');
  if (!storedNotifications) return [];

  try {
    const notifications = JSON.parse(storedNotifications);
    return Array.isArray(notifications) ? notifications : [];
  } catch (error) {
    console.error('Error receiving notifications:', error);
    return [];
  }
};


export const saveNotifications = (notifications: Notification[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('notifications', JSON.stringify(notifications));
};


export const markNotificationAsRead = (notificationId: string): Notification[] => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification =>
    notification.id === notificationId ? { ...notification, read: true } : notification
  );

  saveNotifications(updatedNotifications);
  return updatedNotifications;
};


export const markAllNotificationsAsRead = (): Notification[] => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));

  saveNotifications(updatedNotifications);
  return updatedNotifications;
};


export const deleteNotification = (notificationId: string): Notification[] => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);

  saveNotifications(updatedNotifications);
  return updatedNotifications;
};

export const clearAllNotifications = (): void => {
  saveNotifications([]);
};


export const checkTasksForNotifications = (workspaces: KanbanWorkspace[]): Notification[] => {
  const currentNotifications = getNotifications();
  const newNotifications: Notification[] = [];


  const now = new Date();


  workspaces.forEach(workspace => {
    if (workspace && workspace.columns) {
      workspace.columns.forEach(column => {
        if (column && column.cards) {
          column.cards.forEach(card => {
            if (card && card?.createdAt) {
              const createdDate = new Date(card?.createdAt);
              const daysSinceCreation = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));


              if (daysSinceCreation >= 3) {

                const existingNotification = currentNotifications.find(
                  n => n.taskId === card.id && n.type === 'warning' &&
                  n.message.includes(`${daysSinceCreation} gündür`)
                );


                if (!existingNotification) {
                  newNotifications.push(createNotification({
                    title: 'Task Reminder',
                    message: `"${card.title}" task has not been updated for ${daysSinceCreation} days.`,
                    type: 'warning',
                    taskId: card.id
                  }));
                }
              }
            }
          });
        }
      });
    }
  });

  if (newNotifications.length > 0) {
    const allNotifications = [...currentNotifications, ...newNotifications];
    saveNotifications(allNotifications);
    return allNotifications;
  }

  return currentNotifications;
};
