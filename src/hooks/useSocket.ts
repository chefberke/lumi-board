import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

// Renkli console log fonksiyonları
const log = {
  success: (message: string) => console.log('\x1b[32m%s\x1b[0m', message),
  info: (message: string) => console.log('\x1b[36m%s\x1b[0m', message),
  error: (message: string) => console.log('\x1b[31m%s\x1b[0m', message),
  socket: (message: string) => console.log('\x1b[35m%s\x1b[0m', message),
  warn: (message: string) => console.log('\x1b[33m%s\x1b[0m', message),
};

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Socket bağlantısını başlat
    const initSocket = async () => {
      try {
        if (!socketRef.current) {
          socketRef.current = io(SOCKET_URL, {
            path: '/api/socket',
            addTrailingSlash: false,
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
          });

          socketRef.current.on('connect', () => {
            log.success('Connected to socket server');
          });

          socketRef.current.on('connect_error', (error) => {
            log.error(`Socket connection error: ${error.message}`);
          });

          socketRef.current.on('disconnect', () => {
            log.socket('Disconnected from socket server');
          });
        }
      } catch (error) {
        log.error(`Socket initialization error: ${error}`);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const emit = (event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      log.warn(`Socket not connected. Event not emitted: ${event}`);
    }
  };

  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    emit,
    on,
    off,
    socket: socketRef.current,
  };
};
