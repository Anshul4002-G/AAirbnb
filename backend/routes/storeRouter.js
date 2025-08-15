const express = require('express');
const storeRouter = express.Router();

const storeController = require('../controller/store');

storeRouter.get("/favourite", storeController.getfavourite);
storeRouter.get("/booking", storeController.getbookings);

storeRouter.get("/explore", storeController.getexplore);
storeRouter.get("/about", storeController.getabout);
storeRouter.post("/favourite", storeController.postfavhomes);
storeRouter.post("/deletefav/:homeid", storeController.postdeletefavhome);

module.exports = storeRouter;