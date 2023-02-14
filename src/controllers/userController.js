import User from "../models/User";
import bcrypt from "bcrypt";
import { application } from "express";
import fetch from "node-fetch";
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
  // 유저네임이(유저아이디) 일치하고,소셜온리가 false인 경우 (사용자가 그냥 로그인했는지,소셜로 로그인 했는지 구분하기 위해)
  const user = await User.findOne({ username, socialOnly: false });
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

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  //startGithubLogin에서 받은 코드와 , 클라이언트ID,클라이언트secret을
  //Access토큰 발급 주소로 POST하여, Access토큰을 받는다.
  //이때 💡Access토큰은 startGithubLogin 의 scope 에 적은 내용에 대해서만 사용할 수 있도록 허가해준다.💡
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code, //URL의 text 추출
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    // tokenRequest 안에 access토큰이 있다면
    // access API 주소로 access토큰을 넣어
    // user 정보를 받을수있다.
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    //유저 정보 API
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    //유저 Email API
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // emailData에 primary ,verified 둘다 true인 객체만 추출
    const emailObj = emailData.find((email) => email.primary && email.verified);
    // 위 조건에 맞지 않다면
    if (!emailObj) {
      return res.redirect("/login");
    }
    //User DB의 email 중에서 emailObj.email과 일치하는 User Data추출하여
    //github 계정으로 바로 로그인
    let user = await User.findOne({ email: emailObj.email });

    if (!user) {
      //User DB의 email 중에서 emailObj.email과 일치하지 않을때
      //github 정보로 계정 생성
      //userData 와 emailObj 안에서 빼옴.
      user = await User.create({
        name: userData.name,
        avatarUrl: userData.avatar_url,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    //db의 유저email 과 깃허브의user email 이 같을경우에는 계정이 새로 생성되지 않고,db의 email계정으로 로그인이 된다.
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    //토큰이 없다면 로그인페이지로 이동
    return res.redirect("/login");
  }
};

export const edit = (req, res) => res.send("Edit My Profile");
export const logout = (req, res) => {
  req.session.destroy(); // DB의 세션을 제거한다
  return res.redirect("/");
};
export const see = (req, res) => res.send("See User");
