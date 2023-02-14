import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videosRouter from "./routers/videoRouter";
import session from "express-session";
import MongoStore from "connect-mongo";
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
    secret: process.env.COOKIE_SECRET,
    //모든 브라우저에게 쿠키를 줄것인가??
    resave: false,
    // 세션을 수정할 때만 세션을 DB에 저장하고 쿠키를 넘겨줄 것인가??
    saveUninitialized: false,

    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videosRouter);

export default app;
