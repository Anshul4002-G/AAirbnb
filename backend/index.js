const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");

const app = express();
const mongoose = require("mongoose");
const rootdir = require("./utils/pathutils");
const path = require("path");
const hostRouter = require("./routes/hostRouter");
const storeRouter = require("./routes/storeRouter");
const { errorController } = require("./controller/error");

dotenv.config();
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const multer = require("multer");
const { sign } = require("crypto");
const authRouter = require("./routes/authRouter");

const randomString = (length) => {
  let character = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += character.charAt(Math.floor(Math.random() * character.length));
  }
  return result;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + "-" + file.originalname);
  },
});

const multeroption = {
  storage,
};

const dbpath = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.epq7b.mongodb.net/AirbnbMain`;

app.use(
  session({
    secret: "airbnb data",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(multer(multeroption).single("photo"));
app.use("/uploads", express.static(path.join(rootdir, "uploads")));
app.use("/host/uploads", express.static(path.join(rootdir, "uploads")));
app.use("/homes/uploads", express.static(path.join(rootdir, "uploads")));

app.set("view engine", "ejs");
app.set("views", path.join(rootdir, "view"));

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(hostRouter);
app.use(storeRouter);
app.use(authRouter);
app.use(errorController);

const Port = 4478;

mongoose
  .connect(dbpath)
  .then(() => {
    app.listen(Port, () => {
      console.log(` app is listening on server http://localhost:${Port}`);
    });
  })
  .catch((err) => {
    console.log("unable to launch the server site", err);
  });

module.exports = app;
