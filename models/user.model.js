const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please enter your firstname"],
    },
    lastname: {
      type: String,
      required: [true, "Please enter your lastname"],
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
