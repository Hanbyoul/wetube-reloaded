import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videosRouter from "./routers/videoRouter";
import session from "express-session";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

//세션사용 및 세션 저장 옵션
app.use(
  session({
    secret: "Hello",
    resave: true,
    saveUninitialized: true,
  })
);

//서버에 저장된 세션 data
// app.use((req, res, next) => {
//   req.sessionStore.all((error, session) => {
//     console.log(session);
//     next();
//   });
// });

//세션 middleware
//반드시 session 이먼저 선언되고 난뒤에 선언해야 middleware를 사용할 수 있다.
app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/videos", videosRouter);

export default app;
