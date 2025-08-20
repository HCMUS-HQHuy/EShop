import { Manager, io } from "socket.io-client";

function socketListener() {
  const manager = new Manager(import.meta.env.VITE_BACK_END_SOCKET_URL, {
    withCredentials: true
  });
  const sellerSocket = manager.socket("/seller");
  
  sellerSocket.on("connect", () => {
      console.log("Connected to seller socket");
  });
  
  sellerSocket.on("disconnect", () => {
      console.log("Disconnected from seller socket");
  });
  
  sellerSocket.on("connect_error", (error) => {
    if (sellerSocket.active) {
      console.log("Socket is active and reconnecting...");
    } else {
      console.log("Connection error:", error.message);
    }
  });
  
  sellerSocket.on("status", (data) => {
      console.log("status event received:", data);
  });
}

export default socketListener;