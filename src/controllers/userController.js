import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const exists = await User.exists({ $or: [{ username }, { email }] }); // 각 조건이 true일 때 실행되게 한다.
  const pageTitle = "Join";
  if (password !== password2) {
    // password 중복일 경우
    return res.status(400).render("join", {
      //status Code : 400
      pageTitle,
      errorMessage: "password가 일치하지 않습니다.",
    });
  }

  if (exists) {
    // username,email 중복일 경우
    return res.status(400).render("join", {
      //status Code : 400
      pageTitle,
      errorMessage: "이미 사용중인 username/email 입니다.",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "존재하지 않는 username이거나 잘못 입력하였습니다.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "존재하지 않는 Password 이거나 잘못 입력하였습니다.",
    });
  }

  //session에 data 넣기
  req.session.loggedIn = true;
  //user가 로그인시 session.loggedIn key가 생기면서, true가 된다.
  //session 안에 있기때문에 userController 어디서든 다 사용이 가능하다.
  req.session.user = user; // user가 로그인시 session.user key가 생기면서 , 유저 정보가 들어간다
  return res.redirect("/");
};

export const edit = (req, res) => res.send("Edit My Profile");
export const deleteUser = (req, res) => res.send("Delete My Profile");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
