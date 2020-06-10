
const Post = require('../Models/post');

exports.createPosts = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath : url + "/images/" + req.file.filename,
    creator: req.userData.userId
  })

  console.log(post);
  // console.log(req.userData);
  // return res.status(200).json({});
  post.save().then(createdPost=>{
    res.status(201).json({
      message: "Post added succesfully",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  }).catch(err=>{
    res.status(500).json({message:"Creating a Post failed!"})
  });
}

exports.getPosts = (req, res, next) => {
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
    .catch(err=>{
      res.status(500).json({ message: "Fetching Posts Failed!"})
    });
}

exports.deletePost = (req, res, next)=>{
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result=>{
    console.log(result);
    if(result.n>0){
      res.status(200).json({message: "Post Deleted!"});
    }else{
      res.status(401).json({message:"Not Authorized"});
    }

  })
    .catch(err=>{
      res.status(500).json({ message: "Deleting Post Failed!"})
    })
}

exports.getPost = (req, res, next)=>{
  Post.findById(req.params.id).then(post=>{
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({message: "Post not found"});
    }
  }).catch(err=>{
    res.status(500).json({ message: "Fetching Post Failed!"})
  });
}

exports.updatePost =  (req, res, next)=>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath : imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id:req.params.id}, post).then(result=>{
    console.log(result);
    if(result.n>0){
      res.status(200).json({message: "updated Sucessfullys!"});
    }else{
      res.status(401).json({message:"Not Authorized"});
    }
  })
    .catch(err=>{
      res.status(500).json({ message: "Couldn't update Post!"})
    });
}
