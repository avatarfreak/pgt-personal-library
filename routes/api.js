/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
const uuid = require("uuid/v1");

const db = require("../database/db");

//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  app
    .route("/api/books")
    .get(function(req, res) {
      res.json(db);
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    .post(function(req, res) {
      var _id = uuid();
      var title = req.body.title.trim();
      var comments = [];
      var commentcount = 0;
      if (!title) {
        return res.status(400).send("Title is missing");
      }

      db.push({ _id, title, comments, commentcount });
      res.json({ _id, title });
      //response will contain new book object including atleast _id and title
    })

    .delete(function(req, res) {
      const count = db.length;
      if (count <= 0) {
        return res.status(400).send("Nothing to delete");
      }

      db.splice(0, db.length);
      res.json("complete delete successfull");
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      var bookid = req.params.id;
      let found = db.find(data => data._id === bookid);

      if (!found) {
        return res.status(400).send("no match");
      }
      res.json(found);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment.trim();

      //check uuid pattern
      let pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      if (!bookid.match(pattern)) {
        return res.status(400).send("please provide valid id.");
      }

      if (!comment) {
        return res.status(400).send("comment field is empty");
      }

      //search for matched id in database.
      let book = db.find(key => key._id === bookid);
      if (!book) {
        return res.status(400).send("please provide valid id");
      }
      book.comments.push(comment);
      book.commentcount = book.comments.length;
      res.status(200).send(book);
      //json res format same as .get
    })

    .delete(function(req, res) {
      var bookid = req.params.id;

      let pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      if (!bookid.match(pattern)) {
        return res.status(400).send("please provide valid id.");
      }

      let isfound = db.findIndex(key => key._id === bookid);   

      db.splice(isfound, 1);
      res.status(200).send("delete successful");
      //if successful response will be 'delete successful'
    });
};
