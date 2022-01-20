const express = require("express");
const router = express.Router();
const Audio = require("../models/Audio");
const Comments = require("../models/Comments");

const HomeCategory = require("../models/HomeCategory");

router.get("/", (req, res) => {
  res.send("Audio");
});
router.post("/create", (req, res) => {
  const audio = new Audio(req.body);
  audio.episodesAmount = audio.episodes.length;
  audio.save((err, data) => {
    if (err) res.json({ message: err });
    else res.json(data);
  });
});

router.post("/createHomeCate", (req, res) => {
  const category = new HomeCategory(req.body);
  category.save((err, data) => {
    if (err) res.json({ message: err });
    else res.json(data);
  });
});

router.post("/getHomeCate", (req, res) => {
  try {
    var query = HomeCategory.find({})
      .populate(
        {
          path: "listAudio",
          select: { episodes: 0, decription: 0, comments: 0},
          populate: {
            path: "categories",
          },
        }
      );

    query.exec(function (err, docs) {
      if (err) {
        res.status(400).send(error);
      } else {
        res.send(docs);
      }
    });
  } catch (error) {
    console.log("KHOA " + error);
    res.status(400).send(error);
  }
});

router.post("/find", async (req, res) => {
  const { title } = req.body;

  try {
    if (title.trim() != "") {
      var query = Audio.find({ title: { $regex: title, $options: "i" } })
        .select({ episodes: 0, decription: 0, comments: 0 })
        .populate("categories");
      query.exec(function (err, docs) {
        if (err) {
          res.status(400).send(error);
        } else {
          res.send(docs);
        }
      });
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log("KHOA " + error);
    res.status(400).send(error);
  }
});

router.post("/getAudio", async (req, res) => {
  try {
    var query = Audio.find({})
      .select({ episodes: 0, decription: 0, comments: 0 })
      .populate("categories");
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

router.post("/getByCategory", async (req, res) => {
  const { categoryId } = req.body;

  try {
    var query = Audio.find({ categories: categoryId })
      .select({ episodes: 0, decription: 0, comments: 0 })
      .populate("categories");
    //
    query.exec(function (err, docs) {
      if (err) {
        res.status(400).send(error);
      } else {
        res.send(docs);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/getAudio/:id", function (req, res) {
  var id = req.params.id;
  try {
    var query = Audio.findOne({ _id: id })
      .populate("categories")
      .populate({
        path: "comments",
        populate: {
          path: "writer",
          select: { fullname: 1, avatar: 1 },
        },
      });
    query.exec(function (err, docs) {
      if (err) {
        res.status(400).send(error);
      } else {
        res.send(docs);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/comment", async (req, res) => {
  const { id, writer, title } = req.body;
  try {
    const comment = new Comments({ title, writer });
    comment.save(async (err, data) => {
      console.log("data : " + data._id);
      if (err) res.json({ message: err });
    });
    Audio.findOneAndUpdate(
      { _id: id },
      { $push: { comments: comment._id } },
      { upsert: true, new: true },
      (err, docs) => {
        if (err) {
          res.status(400).send(error);
        } else {
          res.send(docs);
        }
      }
    );
  } catch (error) {
    console.log("KHOA " + error);
    res.status(400).send(error);
  }
});

module.exports = router;
