import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userModel.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userModel.methods.generateToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.TOKEN_SECRET,
    {
      expireIn: process.env.TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userModel);
