import mongoose from "mongoose";

mongoose.set("strictQuery", true); // mongoDB가 v7부터 해당 코드를 실행 하지않으면 db에 저장이 되지않는다.
//수동으로 설정하여 db에 저장되게끔 해야된다.
mongoose.connect("mongodb://127.0.0.1:27017/wetube");

const db = mongoose.connection; //  커넥트가 되어 커넥션을 사용할 수 있다

const handleOpen = () => console.log("🏖️Connected To DB ");
const handleError = (error) => console.log("DB Error", error);

db.on("error", handleError); // .on : 에러가 발생 될 때마다 콘솔에 출력.  여러번
//mongoose.connection.on("error", handleError);  ⬆️ 코드랑 같은 코드이다.

db.once("open", handleOpen); // .once : 서버가 오픈 될때 한번만 콘솔에 출력. 1회성
//mongoose.connection.once("open", handleOpen); ⬆️ 코드랑 같은 코드이다.
