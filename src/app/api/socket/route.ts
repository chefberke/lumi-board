import { NextResponse } from 'next/server';
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

interface ServerWithIO extends NetServer {
  io?: SocketIOServer;
}

let io: SocketIOServer | null = null;

// Renkli console log fonksiyonları
const log = {
  success: (message: string) => console.log('\x1b[32m%s\x1b[0m', '✓', message),
  info: (message: string) => console.log('\x1b[36m%s\x1b[0m', 'ℹ', message),
  error: (message: string) => console.log('\x1b[31m%s\x1b[0m', '✗', message),
  socket: (message: string) => console.log('\x1b[35m%s\x1b[0m', '🔌', message),
};

export async function GET(req: Request) {
  try {
    if (!io) {
      const res = new NextResponse();
      const server = (res as any).socket?.server as ServerWithIO;

      if (!server) {
        // Server bulunamadığında yeni bir HTTP server oluştur
        const httpServer = new NetServer();
        io = new SocketIOServer(httpServer, {
          path: '/api/socket',
          addTrailingSlash: false,
          cors: {
            origin: '*',
            methods: ['GET', 'POST'],
          },
        });

        io.on('connection', (socket) => {
          log.socket(`Client connected: ${socket.id}`);

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
            log.socket(`Client disconnected: ${socket.id}`);
          });
        });

        // Server'ı başlat
        httpServer.listen(3001, () => {
          log.success('Socket.IO server running on port 3001');
        });
      } else {
        // Mevcut server'ı kullan
        io = new SocketIOServer(server, {
          path: '/api/socket',
          addTrailingSlash: false,
          cors: {
            origin: '*',
            methods: ['GET', 'POST'],
          },
        });

        io.on('connection', (socket) => {
          log.socket(`Client connected: ${socket.id}`);

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
            log.socket(`Client disconnected: ${socket.id}`);
          });
        });

        server.io = io;
        log.success('Socket.IO server initialized with existing server');
      }
    }

    return new NextResponse('Socket initialized', { status: 200 });
  } catch (error) {
    log.error(`Socket initialization error: ${error}`);
    return new NextResponse('Socket initialization failed', { status: 500 });
  }
}
