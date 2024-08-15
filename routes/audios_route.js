const express = require("express");
const router = express.Router();
const Audio = require("../models/Audio");
const Comments = require("../models/Comments");

const HomeCategory = require("../models/HomeCategory");

const mongodb = require("../models/mongodb");
const { matches } = require("validator");
const { ObjectID } = require("mongodb");
const { ObjectId } = require("mongodb");
const categories = mongodb.collection("categories");
const audios = mongodb.collection("audios");
const homecategories = mongodb.collection("homecategories");
router.get("/getHomeCate", async (req, res) => {
  try {
    const query = {};
    const options = {
      projection: { comments: 0 },
    };
    var listData = []
    const cursor = homecategories.aggregate([
      {
        $lookup: {
          from: "audios",
          localField: "listAudio",
          foreignField: "_id",
          as: "listAudio",
          pipeline: [
            {
              $lookup: {
                from: "categories",
                localField: "categories",
                foreignField: "_id",
                as: "categories"
              }
            }
          ]
        },

      },
    ]);

    if ((await homecategories.countDocuments(query)) === 0) {
      console.log("No documents found!");
    }
    for await (const doc of cursor) {
      listData.push(doc);
    }
    res.send(listData);
  } catch (error) {
    console.log("KHOA " + error);
    res.status(400).send(error);
  }
});

router.get("/", (req, res) => {
  res.send("Audio");
});
router.post("/create", (req, res) => {
  const audio = new Audio(req.body);
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

router.post("/find", async (req, res) => {
  const { title } = req.body;

  try {
    if (title.trim() != "") {
      try {
        var listData = []
        const cursor = audios.aggregate([
          // {
          //   $match: {
          //     title: {
          //       $regex: title, $options: "i"
          //     }
          //   }
          // },
          { $match: { $text: { $search: title, } } },
          {
            $lookup: {
              from: "categories",
              localField: "categories",
              foreignField: "_id",
              as: "categories"
            }
          }
        ]);

        for await (const doc of cursor) {
          listData.push(doc);
        }
        res.send(listData);
      } catch (error) {
        console.log("KHOA " + error);
        res.status(400).send(error);
      }
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log("KHOA " + error);
    res.status(400).send(error);
  }
});

router.get("/getAudio", async (req, res) => {
  try {
    const query = {};
    const options = {
      projection: { comments: 0 },
    };
    var listData = []
    const cursor = audios.find(query, options);
    if ((await audios.countDocuments(query)) === 0) {
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

router.get("/getAudio2", async (req, res) => {
  audios.createIndex({ "title": "text", });


  try {
    var listData = []
    const cursor = audios.aggregate([
      { $match: { $text: { $search: "nhat", } } },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        }
      },
    ]);

    for await (const doc of cursor) {
      listData.push(doc);
    }
    res.send(listData);
  } catch (error) {
    console.log("KHOA " + error);
    res.status(400).send(error);
  }
});

router.get("/getByCategory/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  console.log(categoryId);
  try {
    var listData = []
    const cursor = audios.aggregate([
      // {
      //   $match: {
      //     // categories: { $elemMatch: { $eq: { $oid: categories } } }
      //     _id: {$eq :{$toObjectId: '620a24fafe0212af7cbb4915'}}
      //   }
      // },
      {
        $search: {
          equals: {
            path: "_id",
            value: ObjectId("620a24fafe0212af7cbb4915")
          }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        }
      },
    ]);
    for await (const doc of cursor) {
      listData.push(doc);
    }
    res.send(listData);
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
