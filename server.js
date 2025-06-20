const express = require("express");
const next = require("next");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// Renkli console log fonksiyonları
const log = {
  success: (message) => console.log("\x1b[32m%s\x1b[0m", "✓", message),
  info: (message) => console.log("\x1b[36m%s\x1b[0m", "ℹ", message),
  error: (message) => console.log("\x1b[31m%s\x1b[0m", "✗", message),
  socket: (message) => console.log("\x1b[35m%s\x1b[0m", "🔌", message),
  warn: (message) => console.log("\x1b[33m%s\x1b[0m", "⚠", message),
};

// Next.js app'i hazırla
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  // CORS ayarları
  server.use(
    cors({
      origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    })
  );

  // Socket.IO kurulumu
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Socket bağlantı yönetimi
  io.on("connection", (socket) => {
    log.socket(`Client connected: ${socket.id}`);

    // Workspace'e katılma
    socket.on("join-workspace", (workspaceId) => {
      socket.join(`workspace-${workspaceId}`);
      log.info(`Client ${socket.id} joined workspace: ${workspaceId}`);
    });

    // Workspace'den ayrılma
    socket.on("leave-workspace", (workspaceId) => {
      socket.leave(`workspace-${workspaceId}`);
      log.info(`Client ${socket.id} left workspace: ${workspaceId}`);
    });

    // Task güncellemeleri
    socket.on("task:update", (data) => {
      const { workspaceId, ...taskData } = data;
      socket.to(`workspace-${workspaceId}`).emit("task:updated", taskData);
      log.info(`Task updated in workspace: ${workspaceId}`);
    });

    // Yeni task oluşturma
    socket.on("task:create", (data) => {
      const { workspaceId, ...taskData } = data;
      socket.to(`workspace-${workspaceId}`).emit("task:created", taskData);
      log.info(`Task created in workspace: ${workspaceId}`);
    });

    // Task silme
    socket.on("task:delete", (data) => {
      const { workspaceId, ...taskData } = data;
      socket.to(`workspace-${workspaceId}`).emit("task:deleted", taskData);
      log.info(`Task deleted in workspace: ${workspaceId}`);
    });

    // Column sırası değişikliği
    socket.on("column:reorder", (data) => {
      const { workspaceId, ...columnData } = data;
      socket
        .to(`workspace-${workspaceId}`)
        .emit("column:reordered", columnData);
      log.info(`Column reordered in workspace: ${workspaceId}`);
    });

    // Task sürükleme
    socket.on("task:drag", (data) => {
      const { workspaceId, ...dragData } = data;
      socket.to(`workspace-${workspaceId}`).emit("task:dragged", dragData);
      log.info(`Task dragged in workspace: ${workspaceId}`);
    });

    // Task durum değişikliği
    socket.on("task:status-change", (data) => {
      const { workspaceId, ...statusData } = data;
      socket
        .to(`workspace-${workspaceId}`)
        .emit("task:status-changed", statusData);
      log.info(`Task status changed in workspace: ${workspaceId}`);
    });

    // Kullanıcı aktivitesi (typing, editing vb.)
    socket.on("user:activity", (data) => {
      const { workspaceId, ...activityData } = data;
      socket
        .to(`workspace-${workspaceId}`)
        .emit("user:activity-update", activityData);
    });

    // Bağlantı koptuğunda
    socket.on("disconnect", () => {
      log.socket(`Client disconnected: ${socket.id}`);
    });

    // Hata durumları
    socket.on("error", (error) => {
      log.error(`Socket error for ${socket.id}: ${error.message}`);
    });
  });

  // Socket.IO endpoint'i
  server.get("/socket.io/*", (req, res) => {
    res.status(200).json({ message: "Socket.IO server is running" });
  });

  // Tüm diğer istekleri Next.js'e yönlendir
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // Server'ı başlat
  httpServer.listen(port, () => {
    log.success(`Server is running on http://${hostname}:${port}`);
    log.socket("Socket.IO server is ready");
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    log.info("SIGTERM received, shutting down gracefully");
    httpServer.close(() => {
      log.success("Server closed");
      process.exit(0);
    });
  });
});
