const express = require("express");
const mongoose = require("mongoose");
var admin = require("firebase-admin");
var serviceAccount = require("./firebase.json");
const { getDatabase } = require('firebase-admin/database');

// INIT DB
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//INIT FIREBASE
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gamewolrd-2487d-default-rtdb.asia-southeast1.firebasedatabase.app"
});



// app.use((req, res, next) => {
//   const allowedOrigins = [
//     "https://kflower.netlify.app",
//   ];
//   //
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }
//   res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", true);
//   return next();
// });
require("dotenv/config");
//import routes
const userRoute = require("./routes/users_route");

app.use("/users", userRoute);

var server = require("http").Server(app);
//ROUTES

app.get("/", (req, res) => {
  res.send("We are on home");
});
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    console.log("Connected to MongoDB !");
  }
);

server.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
