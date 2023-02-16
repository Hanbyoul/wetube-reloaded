import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) =>
  res.render("users/join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const exists = await User.exists({ $or: [{ username }, { email }] });
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: "password가 일치하지 않습니다.",
    });
  }
  if (exists) {
    return res.status(400).render("users/join", {
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
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) =>
  res.render("users/login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("users/login", {
      pageTitle,
      errorMessage: "존재하지 않는 username이거나 잘못 입력하였습니다.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("users/login", {
      pageTitle,
      errorMessage: "존재하지 않는 Password 이거나 잘못 입력하였습니다.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
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
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
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
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";

    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find((email) => email.primary && email.verified);
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
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
    console.log("🎁", userData);
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

// KAKAOLOGIN

export const startKakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: process.env.KAKAO_FINISH_URI,
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishKakaoLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    client_id: process.env.KAKAO_CLIENT,
    grant_type: "authorization_code",
    redirect_uri: process.env.KAKAO_FINISH_URI,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const kakaoToken = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in kakaoToken) {
    const { access_token } = kakaoToken;
    const apiUrl = "https://kapi.kakao.com";
    const userData = await (
      await fetch(`${apiUrl}/v2/user/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    const emailData = userData.kakao_account;
    if (
      emailData.is_email_valid === false ||
      emailData.is_email_verified === false
    ) {
      return redirect("/login");
    }
    let user = await User.findOne({ email: emailData.email });

    if (!user) {
      user = await User.create({
        email: userData.kakao_account.email,
        avatarUrl: userData.kakao_account.profile.thumbnail_image_url,
        socialOnly: true,
        username: "scope schema 재설정해야됨",
        password: "",
      });
    }
    console.log("🧲", userData);
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

// KAKAOLOGIN

export const getEdit = (req, res) => {
  const pageTitle = "Edit Profile";
  return res.render("users/edit-profile", { pageTitle });
};

export const postEdit = async (req, res) => {
  const pageTitle = "Edit Profile";
  const {
    session: {
      user: { _id, username: sessionUserName, email: sessionEmail, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;

  if (username !== sessionUserName) {
    const exists = await User.exists({ username });
    if (exists) {
      return res.status(400).render("users/edit-profile", {
        pageTitle,
        errorMessage: "이미 사용중인 username 입니다.",
      });
    }
  } else if (email !== sessionEmail) {
    const exists = await User.exists({ email });
    if (exists) {
      return res.status(400).render("users/edit-profile", {
        pageTitle,
        errorMessage: "이미 사용중인 email 입니다.",
      });
    }
  }
  console.log(file);
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      //user가 파일을 업로드하면 , file은 path를 얻게되고
      // 그 path값을 사용한다.
      //user가 파일을 업로드하지 않고 프로필을 수정하면
      //파일의 상태는 undefined이고 , 기존에있던 아바타path를 다시 사용한다.
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  console.log("avata", avatarUrl);
  req.session.user = updateUser;
  return res.redirect("/users/edit");
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  const pageTitle = "Change Password";
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", {
    pageTitle,
  });
};

export const postChangePassword = async (req, res) => {
  const pageTitle = "Change Password";
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await User.findById({ _id });
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle,
      errorMessage: "기존 password가 일치하지 않습니다.",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle,
      errorMessage: "변경할 password가 일치하지 않습니다.",
    });
  }

  user.password = newPassword;
  await user.save();
  req.session.destroy();
  return res.redirect("/login");
};

export const see = (req, res) => res.send("See User");
