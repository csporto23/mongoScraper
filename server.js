const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const handlebars = require("handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

const db = require("./models");

const PORT = 8080;

const app = express();


//logs and request
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//public folder
app.use(express.static("public"));







//routes





//server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});