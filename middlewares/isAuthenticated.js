const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token }).select("account _id");
    if (user) {
      req.user = user;

      return next();
    } else {
      res.status(401).json({ error: "unauthorized" });
    }
  } else {
    return res.status(401).json({ error: "unauthorized" });
  }
};

module.exports = isAuthenticated;
