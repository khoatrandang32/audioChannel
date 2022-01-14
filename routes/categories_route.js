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


module.exports = router;
