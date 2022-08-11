// WebSocket 을 이용한 테스트
// npm install ws --save
const WebSocketS = require("ws").Server;
const wss = new WebSocketS({ port: 3001 });

wss.on("connection", (ws) => {
  ws.send("Hello! I'am a Server");
  ws.on("message", (message) => {
    console.log("Received: %s", message);
  });
});
