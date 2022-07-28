const mongoose = require("mongoose");

const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  birthday:{
    type: Number
  },
  phoneNumber: {
    type: String,
    required: [true, "PhoneNumber is required !"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (number) {
        return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/
        .test(number);
      },
      message: (props) => `${props.value} is not a valid phonenumber!`,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required !"],
    minLength: 7,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  tokens: [
    {
      token: {
        type: String,
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

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email }, (error, data) => {});

  if ((user == null) | !user) {
    return null;
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return null;
  }
  return user;
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
