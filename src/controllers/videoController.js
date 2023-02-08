import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}); // VideoDB에서 Video 전체를 꺼낸다
  console.log(videos);
  return res.render("home", { pageTitle: "Home", videos }); // home.pug(템플릿)을 랜더 한다
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id); // id를 가지고 id대상을 찾는다 //
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id); //해당 db전체에서 ID에 해당하는 Object 자체를 반환
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit", { pageTitle: video.title, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  // const video = await Video.findById(id);
  // video 오브젝트를 사용하는 것이 아니라 video의 존재 유,무만 파악하면 되기때문에
  // exists로 조건을 설정하여 확인 할 수 있다.
  const video = await Video.exists({ _id: id });
  // DB속 Data ID 중에서 현재 ID 가 존재하는지 true/false 를 리턴한다
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: hashtags.split(",").map((i) => (i.startsWith("#") ? i : `#${i}`)),
  });

  // video.title = title;
  // video.description = description;
  // video.hashtags = hashtags
  //   .split(",")
  //   .map((i) => (i.startsWith("#") ? i : `#${i}`));
  // await video.save();
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags
        .split(",")
        .map((i) => (i.startsWith("#") ? i : `#${i}`)),
    });
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }

  return res.redirect("/");
};
