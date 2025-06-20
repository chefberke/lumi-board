import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

// Renkli console log fonksiyonları
const log = {
  success: (message: string) => console.log('\x1b[32m%s\x1b[0m', '✅ SOCKET:', message),
  info: (message: string) => console.log('\x1b[36m%s\x1b[0m', 'ℹ️ SOCKET:', message),
  error: (message: string) => console.log('\x1b[31m%s\x1b[0m', '❌ SOCKET:', message),
  socket: (message: string) => console.log('\x1b[35m%s\x1b[0m', '🔌 SOCKET:', message),
  warn: (message: string) => console.log('\x1b[33m%s\x1b[0m', '⚠️ SOCKET:', message),
};

export const useSocket = (workspaceId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const currentWorkspaceRef = useRef<string | null>(null);

  useEffect(() => {
    // Socket bağlantısını başlat
    const initSocket = async () => {
      try {
        if (!socketRef.current) {
          socketRef.current = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
          });

          socketRef.current.on('connect', () => {
            log.success('Connected to socket server');
            // Eğer workspace varsa otomatik katıl
            if (workspaceId && workspaceId !== currentWorkspaceRef.current) {
              joinWorkspace(workspaceId);
            }
          });

          socketRef.current.on('connect_error', (error) => {
            log.error(`Socket connection error: ${error.message}`);
          });

          socketRef.current.on('disconnect', (reason) => {
            log.socket(`Disconnected from socket server: ${reason}`);
          });

          socketRef.current.on('reconnect', (attemptNumber) => {
            log.success(`Reconnected to socket server (attempt: ${attemptNumber})`);
            // Yeniden bağlanınca workspace'e tekrar katıl
            if (currentWorkspaceRef.current) {
              joinWorkspace(currentWorkspaceRef.current);
            }
          });
        }
      } catch (error) {
        log.error(`Socket initialization error: ${error}`);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        // Workspace'den ayrıl
        if (currentWorkspaceRef.current) {
          leaveWorkspace(currentWorkspaceRef.current);
        }
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Workspace değişikliklerini takip et
  useEffect(() => {
    if (workspaceId && workspaceId !== currentWorkspaceRef.current) {
      // Önceki workspace'den ayrıl
      if (currentWorkspaceRef.current) {
        leaveWorkspace(currentWorkspaceRef.current);
      }
      // Yeni workspace'e katıl
      joinWorkspace(workspaceId);
    }
  }, [workspaceId]);

  const joinWorkspace = (workspaceId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join-workspace', workspaceId);
      currentWorkspaceRef.current = workspaceId;
      log.info(`Joined workspace: ${workspaceId}`);
    }
  };

  const leaveWorkspace = (workspaceId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave-workspace', workspaceId);
      log.info(`Left workspace: ${workspaceId}`);
    }
    currentWorkspaceRef.current = null;
  };

  const emit = (event: string, data: any) => {
    if (socketRef.current?.connected) {
      // Workspace ID'sini otomatik ekle
      const dataWithWorkspace = currentWorkspaceRef.current
        ? { ...data, workspaceId: currentWorkspaceRef.current }
        : data;

      socketRef.current.emit(event, dataWithWorkspace);
      log.info(`Event emitted: ${event}`);
    } else {
      log.warn(`Socket not connected. Event not emitted: ${event}`);
    }
  };

  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
      log.info(`Event listener added: ${event}`);
    }
  };

  const off = (event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
      log.info(`Event listener removed: ${event}`);
    }
  };

  return {
    emit,
    on,
    off,
    socket: socketRef.current,
    joinWorkspace,
    leaveWorkspace,
    isConnected: socketRef.current?.connected || false,
    currentWorkspace: currentWorkspaceRef.current,
  };
};
