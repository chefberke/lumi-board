import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocket = (res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Task güncellemeleri
      socket.on('task:update', (data) => {
        socket.broadcast.emit('task:updated', data);
      });

      // Yeni task oluşturma
      socket.on('task:create', (data) => {
        socket.broadcast.emit('task:created', data);
      });

      // Task silme
      socket.on('task:delete', (data) => {
        socket.broadcast.emit('task:deleted', data);
      });

      // Column sırası değişikliği
      socket.on('column:reorder', (data) => {
        socket.broadcast.emit('column:reordered', data);
      });

      // Task sürükleme
      socket.on('task:drag', (data) => {
        socket.broadcast.emit('task:dragged', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  return res.socket.server.io;
};
