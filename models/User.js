const mongoose = require("mongoose");

const User = mongoose.model("User", {
  hash: String,
  salt: String,
  token: String,
  /*
  user_image: { type: mongoose.Schema.Types.Mixed, default: {} },
  */
  email: {
    unique: true,
    type: String,
  },

  account: {
    username: {
      required: true,
      type: String,
    },
    phone: String,
  },
});

module.exports = User;
