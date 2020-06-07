const express = require('express');
const router = express.Router();
const Post = require('../Models/post');
const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/jpeg' : 'jpg',
  'image/jpe' : 'jpg',
  'image/png' : 'png'

};
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Meme type");
    if(isValid){
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    console.log(file.mimetype);
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext );
  }
});

router.post("",multer({storage:storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath : url + "/images/" + req.file.filename
  })
  console.log(post);
  post.save().then(createdPost=>{
    res.status(201).json({
      message: "Post added succesfully",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });

});

router.get("", (req, res, next) => {
  let fetchedPosts;
  const postQuery = Post.find();
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  if(pageSize&& currentPage){
    postQuery
      .skip(pageSize*(currentPage-1))
      .limit(pageSize);
  }
  postQuery
    .then(document=>{
      fetchedPosts = document;
      return Post.count();
    }).then(count=>{
    res.status(200).json({
      message: "posts fetch sucessfully",
      posts: fetchedPosts,
      maxPosts: count
    });
  })
});

router.delete("/:id", (req, res, next)=>{
  Post.deleteOne({_id: req.params.id}).then(result=>{
    console.log(result);
    res.status(200).json({message: "Post Deleted!"});
  })
});

router.get("/:id", (req, res, next)=>{
  Post.findById(req.params.id).then(post=>{
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({message: "Post not found"});
    }
  });
});

router.put("/:id",multer({storage:storage}).single("image"),  (req, res, next)=>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath : imagePath
  });
  Post.updateOne({_id:req.params.id}, post).then(result=>{
    console.log(result);
    res.status(200).json({message: "updated Sucessfullys!"});
  });
});

module.exports = router;
