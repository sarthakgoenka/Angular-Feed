const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Post = require('./Models/post');
const User = require('./Models/user');
const bodyParser = require('body-parser');
const postRoutes = require('./Routes/posts');
const userRoutes = require('./Routes/user');
const path = require('path');
mongoose.connect(
  'mongodb+srv://sarthak:jaimaatwb@angular-node-uxkpp.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(()=>{
    console.log("connected to the database");
  }).catch(()=>{
   console.log('connection failed');
});

const posts = [
  {
    id: "1341x3eadf",
    title: "first server-side post",
    content: "this is comming from the server"
  },
  {
    id: "234455xdf",
    title: "second server-side post",
    content: "this is comming from the server"
  }
];
// wPiw3v73f4UO1xZX

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
// wPiw3v73f4UO1xZX
app.use('/images', express.static(path.join('backend/images')));
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
