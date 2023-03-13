import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {}; //undefined 대신 빈 오브젝트 배출

  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    //로그인이 된 사람만 다음 단계 진행
    return next();
  } else {
    req.flash("error", "Not authorized"); //타입과 메세지를 넣는다.
    //로그인이 되지 않았다면 로그인페이지로 리다이렉트
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    //로그인 되지않은 사람만 다음 단계 진행.
    return next();
  } else {
    req.flash("error", "Not authorized");
    //로그인이 된사람은 홈페이지로 리다이렉트
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 4000000,
    //upload 할때 파일의 용량을 제한한다.
    //bytes 단위이다.
  },
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000, //10Mb
  },
});
