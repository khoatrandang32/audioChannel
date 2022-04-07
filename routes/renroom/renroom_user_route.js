const express = require("express");
const router = express.Router();
const User = require("../../models/RenRoomUser");
const auth = require("../../middleware/auth");

router.get("/", (req, res) => {
  res.send("User");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByCredentials(username, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/regist", async (req, res) => {
  const { fullname, username, password } = req.body;
  try {
    const user = new User({
      fullname,
      username,
      password,
    });
    user.save((err, data) => {
      if (err) res.status(400).send({ error: err });
      else res.json({ message: "OK" });
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/userlist", auth, async (req, res) => {
  User.find({ active: true }, {}, (err, docs) => {
    if (err) {
      res.status(400).send(error);
    } else {
      res.send(docs);
    }
  });
});

router.get("/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send("Log out success!");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
