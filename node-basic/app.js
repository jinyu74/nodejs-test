// HTML5 WebSocket은 매우 유용한 기술이지만 오래된 브라우저의 경우 지원하지 않는 경우가 있다.
// 브라우저 간 호환이나 이전 버전 호환을 고려하여 Node.js를 위한 강력한 Cross-platform WebSocket API인 Socket.io를 사용하는 것이 바람직하다.
// npm install --save --save-exact socket.io express

const port = 3000;
// Express를 사용하여 http 서버를 생상한다.
const app = require("express")();
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// http server를 socket.io server로 upgrade
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.get("/", (req, res) => res.render("chat.html"));

// connection event handler
// connection 이 수립되면 event handler function의 인자로 socket이 들어온다
io.on("connection", (socket) => {
  // 접속한 클라이언트의 정보가 수신되면
  socket.on("login", (data) => {
    console.log(
      `Client logged-in:\n name: ${data.name} \n userid: ${data.userid}`
    );

    // socket에 클라이언트 정보를 저장한다.
    socket.name = data.name;
    socket.userid = data.userid;

    // 접속된 모든 클라이언트에게 메시지를 전송한다.
    io.emit("login", data.name);
  });

  // 클라이언트로부터의 메시지가 수신되면
  socket.on("chat", (data) => {
    console.log(`Message from ${socket.name}: ${data.msg}`);

    let msg = {
      from: {
        name: socket.name,
        userid: socket.userid,
      },
      msg: data.msg,
    };

    // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
    socket.broadcast.emit("chat", msg);

    // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
    // socket.emit('s2c chat', msg);

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    // io.emit('s2c chat', msg);

    // 특정 클라이언트에게만 메시지를 전송한다
    // io.to(id).emit('s2c chat', msg)
  });

  // force client disconnect from server
  socket.on("forceDisconnect", () => {
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.name}`);
  });
});

server.listen(port, () =>
  console.log("Socket IO server listening on port 3000")
);
