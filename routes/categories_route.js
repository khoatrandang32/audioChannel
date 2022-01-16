const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.get("/", (req, res) => {
  res.send("Categories");
});
router.post("/create", (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) res.json({ message: err });
    else res.json(data);
  });
});


router.post("/getAll", async (req, res) => {
  try {
    var query = Category.find({});
    query.exec(function (err, docs) {
      if (err) {
        res.status(400).send(error);
      } else {
        res.send(docs);
      }
    });

    // Audio.find({}, {}, (err, docs) => {
    //   if (err) {
    //     res.status(400).send(error);
    //   } else {
    //     res.send(docs.reverse());
    //   }
    // }).limit(req.body.limit).skip(req.body.skip).sort({createAt:-1});
  } catch (error) {
    res.status(400).send(error);
  }
});


module.exports = router;
