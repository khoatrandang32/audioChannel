const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://khoatddev:KhoaKanji111@cluster0.mvaaj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

module.exports = client.db("audioChannel");