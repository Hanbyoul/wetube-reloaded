import express from "express";

const PORT = 4000;

const app = express();

const routerLogger = (req, res, next) => {
  console.log("PATH", req.path);
  next();
};

const methodLogger = (req, res, next) => {
  console.log("METHOD", req.method);
  next();
};

const handleHome = (req, res) => {
  console.log("END HOME!");
  res.send("HI~!");
};

const login = (req, res) => {
  return res.send("LOGIN");
};

app.use(methodLogger, routerLogger);
app.get("/login", login);
app.get("/", handleHome);

const handleListening = () =>
  console.log(`server listening on port http://localhost:${PORT}`);

app.listen(4000, handleListening);
