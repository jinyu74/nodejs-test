const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

let room = ["room1", "room2"];

app.get("/", (req, res) => res.render("chat"));

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("leaveRoom", (num, name) => {
    socket.leave(room[num], () => {
      console.log(`${name} leave a ${room[num]}`);
      io.to(room[num]).emit("leaveRoom", num, name);
    });
  });

  socket.on("joinRoom", (num, name) => {
    socket.join(room[num], () => {
      console.log(`${name} join a ${room[num]}`);
      io.to(room[num]).emit("joinRoom", num, name);
    });
  });

  socket.on("chat message", (num, name, msg) => {
    io.to(room[num]).emit("chat message", name, msg);
  });
});

server.listen(port, () =>
  console.log("Socket IO server listening on port 3000")
);
