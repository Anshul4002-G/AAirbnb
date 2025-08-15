const express = require("express");
const hostRouter = express.Router();

const hostController = require("../controller/host");

hostRouter.get("/", hostController.getHome);
hostRouter.get("/home", hostController.getHome);
hostRouter.get("/home/add-home", hostController.getaddhome);
hostRouter.post("/home/add-home", hostController.postaddhome);
hostRouter.get("/homes/:homeid", hostController.getHomeDetails);
hostRouter.get("/host-home-list", hostController.gethosthomelist);
hostRouter.get("/home/edit-home/:homeid", hostController.getEdithome);
hostRouter.post("/home/edit-home", hostController.postEdithome);
hostRouter.post("/deletehome/:homeid", hostController.postdeletehome);
hostRouter.post("/home/book/:homeid", hostController.postbooked);
hostRouter.post("/cancel-booking/:homeid", hostController.postCancelBooking);
hostRouter.get("/profile", hostController.getProfile);

module.exports = hostRouter;
