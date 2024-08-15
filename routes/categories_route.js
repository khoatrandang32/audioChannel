const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

const mongodb = require("../models/mongodb");
const categories = mongodb.collection("categories");
const audios = mongodb.collection("audios");
const homecategories = mongodb.collection("homecategories");


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


router.get("/getAll", async (req, res) => {
  try {
    const query = {};
    const options = {
      projection: { comments: 0 },
    };
    var listData = []
    const cursor = categories.find(query, options);
    if ((await categories.countDocuments(query)) === 0) {
      console.log("No documents found!");
    }
    for await (const doc of cursor) {
      listData.push(doc);
    }
   res.send(listData);
  } catch (error) {
    res.status(400).send(error);
  }
});


module.exports = router;
