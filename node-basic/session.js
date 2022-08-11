// 나는 에러남 -_-;;;;
//  npm install connect-redis --save
const app = require("express")();
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
const { createClient } = require("redis");
let client = createClient({
  host: "localhost",
  port: 6379,
  password: "",
  logErrors: true,
});
// redisClient.connect().catch(console.error);

// session 설정
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "Rs89I67YEA55cLMgi0t6oyr8568e6KtD",
    cookie: {
      httpOnly: true,
      secure: false,
    },
    store: new RedisStore({ client }),
  })
);

// routing 설정
app.get("/redis-store-counter", (req, res) => {
  let session = req.session;
  if (session && session.count) {
    session.count++;
  } else {
    session.count = 1;
  }
  res.send(`count is ${session.count}`);
});

app.get("/session-destroy", (req, res) => {
  req.session.destroy();
  res.send("Session Destroyed!");
});

app.listen(3000, () => console.log("Express server listening on port 3000"));
