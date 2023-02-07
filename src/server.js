import "./db"; // db 파일을 (파일자체) import 하면 , 나의 서버가 자동으로 mongo와 연결이 된다
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videosRouter from "./routers/videoRouter";
const PORT = 4000;
const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true })); // express가 form의 value들을 이해할수 있도록하고,자바스크립트 형식으로 변형시켜준다
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/videos", videosRouter);

const handleListening = () =>
  console.log(`🏖️server listening on port http://localhost:${PORT}`);

app.listen(4000, handleListening);
