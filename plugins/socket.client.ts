import { io } from "socket.io-client";

export default defineNuxtPlugin(() => {
  const socket = io("http://localhost:4000"); // Connect to Socket.io bridge server

  return {
    provide: {
      socket,
    },
  };
});
