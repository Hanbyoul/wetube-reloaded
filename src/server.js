import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videosRouter from "./routers/videoRouter";
const PORT = 4000;

console.log(process.cwd());

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug"); //express에게 view 엔진으로 pug 쓰겟다고 선언
app.set("views", process.cwd() + "/src/views"); // express 경로 변경
app.use(logger);
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/videos", videosRouter);

const handleListening = () =>
  console.log(`server listening on port http://localhost:${PORT}`);

app.listen(4000, handleListening);
