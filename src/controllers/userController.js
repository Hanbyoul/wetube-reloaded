export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = (req, res) => {};
export const edit = (req, res) => res.send("Edit My Profile");
export const deleteUser = (req, res) => res.send("Delete My Profile");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
