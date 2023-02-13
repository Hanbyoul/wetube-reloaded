import mongoose from "mongoose";

console.log(process.env.COOKIE_SECRET, process.env.DB_URL);

mongoose.set("strictQuery", true);

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleOpen = () => console.log("🏖️Connected To DB ");
const handleError = (error) => console.log("DB Error", error);

db.on("error", handleError);

db.once("open", handleOpen);
