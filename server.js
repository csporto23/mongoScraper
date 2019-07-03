const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("morgan");
const exphbs = require("express-handlebars");




const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

const db = require("./models");

const PORT = process.env.PORT || 8080;


const app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//logs and request
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//public folder
app.use(express.static("views"));






//routes
app.get("/scrape", function(req, res) {

    axios.get("https://www.npr.org/sections/news/").then(function(response) {

      var $ = cheerio.load(response.data);

      $("h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  

        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
          result.p = $(this)
          .children("a")
          .text();
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

  app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle); 
    })
    .catch(function(err) {
      res.json(err);
    });
  });

  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  });


  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  });




//server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});