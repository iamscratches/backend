const Post = require('../models/post');
var admin = require("firebase-admin");
var serviceAccount = require("../ServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://scratchgram-39bb2.firebaseio.com"
});
//          CREATE POST
exports.createPosts = (req, res, next) => {
  // const url = req.protocol + "://" + req.get("host");
  admin.storage().bucket('scratchgram-39bb2.appspot.com').upload(req.file.path).then((snapshot) => {
    console.log("Sucessfully added");
    // console.log(snapshot.ref.getDownloadURL());
    // console.log(snapshot[0].metadata.mediaLink);
    var imagePath = snapshot[0].metadata.mediaLink;
    const post = new Post({
      title : req.body.title,
      content : req.body.content,
      imagePath : imagePath,
      creator: req.userData.userId
    });
    post.save().then(createdPost => {
      res.status(201).json({//everything OK with a new resource being created
        message : 'Post added successfully',
        post:{
          id : createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath
        }
      });
    }).catch(error => {
      // console.log(error);
      res.status(500).json({      
        message: "Something went wrong while saving ur post pls try again!!"
      })
    });
  }).catch(err => {
    console.log(err);
  })
  
}
//         UPDATE POST
exports.updatePost = async (req,res,next) => {
  // console.log(req.file);
  // console.log(req.body);
  let imagePath = req.body.imagePath;
  // console.log(imagePath);
  if(req.file){
    // const url = req.protocol + "://" + req.get("host");
    // imagePath = url + "/images/" + req.file.filename;
    const store = await admin.storage().bucket('scratchgram-39bb2.appspot.com').upload(req.file.path).then((snapshot) => {
      console.log("Sucessfully added");
      // console.log(snapshot.ref.getDownloadURL());
      // console.log(snapshot[0].metadata.mediaLink);
      imagePath = snapshot[0].metadata.mediaLink;
    })
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  //console.log(post)
  Post.updateOne({_id: req.params.id, creator: req.userData.userId },post).then(result => {
    //console.log(result);
    if(result.n > 0){
      res.status(200).json({message: 'update successfull!!'});
    }
    else{
      res.status(401).json({message: 'update unsuccessfull!!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "OOPs!! Something went wrong, pls try again!!"
    })
  });
}

//    GET ALL POSTS
exports.getPosts = (req, res, next)=> {
  //console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  //console.log(pageSize);
  //console.log(currentPage);
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage){
    //console.log("I'm here")
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery.then(documents => {
    //console.log(documents);
    fetchedPosts = documents;
    return Post.countDocuments();
  }).then(countDocuments => {
    //console.log(countDocuments);
    res.status(200).json({//status 200 is everything is OK
      message: 'Posts send successfully!',
      posts: fetchedPosts,
      maxposts: countDocuments
    });
  }).catch(error => {
    res.status(500).json({
      message: "Post fetching failed please reload the page or try again later!!"
    })
  });
}


//          GET SPECIFIC POST
exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({message: "Post not found!"});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Post fetching failed please reload the page or try again later!!"
    })
  });
}


//          DELETE POST
exports.deletePost =  (req, res, next) => {

  //console.log(req.params.id);
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId }).then(result => {
    //console.log(result);
    if(result.n > 0){
      res.status(200).json({message: 'Deletion successfull!!'});
    }
    else{
      res.status(401).json({message: 'Deletion unsuccessfull!!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Post deletion failed please reload the page or try again later!!"
    })
  });
}
