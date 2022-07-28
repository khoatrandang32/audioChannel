const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  res.send("User");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
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

router.post("/register", async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = new User({
      phoneNumber,
      password,
    });
    user.save((err, data) => {

      console.log(err);

      if (err) {
        if(err.code==11000){
          res.send({ 
            status:2,
            message:"phoneNumber is not available!"
          });

        } else{
          res.send({ 
            status:1,
            message:"failed"
          });
        }
       
      }
      else {
        res.send({ 
          status:0,
          message:"success"
        });
      }
    });
  } catch (error) {
    res.send({ 
      status:1,
      message:"failed"
    });  }
});


router.post("/checkPhoneNumber", async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    User.find({ phoneNumber }, {}, (err, docs) => {
      if (err) {
        res.send({ 
          status:1,
          message:"failed"
        });  

      } else {
        res.send({ 
          status: docs.length>0?0:1,
          message:docs.length>0?"success":"failed"
        });  
      }
    });
  } catch (error) {
    res.send({ 
      status:1,
      message:"failed"
    });  }
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
