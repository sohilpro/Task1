import { createServer } from "http";
import { Server } from "socket.io";
import WebSocket from "ws"; // Install ws: npm install ws

const PORT = process.env.PORT || 4000;
const EXTERNAL_WS_URL = "wss://wsg.ok-ex.io/ws";

// Create HTTP Server for Socket.io
const httpServer = createServer();

// Initialize Socket.io Server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Set this to your frontend URL in production for security
  },
});

// Connect to External WebSocket Server
let externalWs = new WebSocket(EXTERNAL_WS_URL);

const connectExternalWs = () => {
  externalWs = new WebSocket(EXTERNAL_WS_URL);

  externalWs.on("open", () => {
    console.log("✅ Connected to external WebSocket server");
  });

  externalWs.on("message", (data) => {
    // console.log("📩 Received from external WebSocket:", data.toString());
    io.emit("message", data.toString()); // Forward to all clients
  });

  externalWs.on("error", (err) => {
    console.error("❌ External WebSocket error:", err);
    reconnectExternalWs(); // Attempt to reconnect on error
  });

  externalWs.on("close", () => {
    console.warn("⚠️ External WebSocket connection closed");
    reconnectExternalWs(); // Attempt to reconnect on close
  });
};

// Reconnection logic for External WebSocket
const reconnectExternalWs = () => {
  setTimeout(() => {
    console.log("⏳ Attempting to reconnect to external WebSocket...");
    connectExternalWs();
  }, 5000); // Retry every 5 seconds
};

// Send Request to WebSocket Every 2 Minutes
const sendRequestEvery = () => {
    if (externalWs.readyState === WebSocket.OPEN) {
      console.log("📤 Sending request to external WebSocket...");
      // Create your payload/request here
      const requestPayload = JSON.stringify({
        op: "subscribe",
        args: [
          { channel: "tickers", instId: "BTC-USDT" },
          { channel: "tickers", instId: "ETH-USDT" },
        ],
      });

      externalWs.send(requestPayload);
    } else {
      console.warn("⚠️ WebSocket not open. Skipping request.");
    }
  
};

// Handle Incoming Socket.io Clients
const handleSocketConnections = () => {
  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("message", (msg) => {
      // console.log("📤 Sending to external WebSocket:", msg);
      if (externalWs.readyState === WebSocket.OPEN) {
        externalWs.send(msg); // Forward client message to external WebSocket
      } else {
        console.warn(
          "⚠️ External WebSocket not open, unable to forward message."
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};

// Start the WebSocket Bridge Server
const startServer = () => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Socket.io server running on http://localhost:${PORT}`);
  });
};

// Initialize the application
const initializeApp = () => {
  connectExternalWs(); // Connect to the external WebSocket server
  handleSocketConnections(); // Handle Socket.io connections
  sendRequestEvery(); // Periodically send requests to the external WebSocket every 2 minutes
  startServer(); // Start the HTTP server with Socket.io
};

// Run the application
initializeApp();
