const mongoose = require("mongoose");

const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Fullname is required !"],
    trim: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
    required: [true, "Username is required !"],
    unique: true,
    lowercase: true,
    minLength: 6,
  },
  password: {
    type: String,
    required: [true, "Password is required !"],
    minLength: 6,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await RenRoomUser.findOne({ username }, (error, data) => {});

  if ((user == null) | !user) {
    return null;
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return null;
  }
  return user;
};

const RenRoomUser = mongoose.model("RenRoomUser", userSchema);

module.exports = RenRoomUser;
