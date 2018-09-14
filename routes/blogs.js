const User=require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router)=>{
    
    router.post('/newBlog',(req,res)=>{
        console.log(JSON.stringify(req.body.title));
        if(!req.body.title){
            res.json({success:false,message:'Blog title is required'});
        }
        else{
            if(!req.body.body){
                res.json({success:false,message:'Blog body is required.'});
            }
            else{
                if(!req.body.createdBy){
                    res.json({ success:false,message:'Blog creator is required.'});
                }else{
                    const blog = new Blog({
                        title:req.body.title,
                        body:req.body.body,
                        createdBy: req.body.createdBy
                    });
                    blog.save((err) =>{
                        if(err){
                            if(err.errors){
                                if(err.errors.title){
                                    res.json({success:false,message:err.errors.title.message});
                                }
                                else{
                                    if(err.errors.body){
                                        res.json({success:false,message:err.errors.body.message});
                                    }
                                    else{
                                        res.json({success:false, message:err.message});
                                    }
                                }
                            }else{
                                res.json({success:false,message:err.message});
                            }
                        }else{
                            res.json({success:true,message:"Blog Saved!"});
                        }
                    });
                }
            }
        }
    });

    router.get('/allBlogs',(req,res) =>{
        Blog.find({},(err,blogs)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(!blogs){
                    res.json({success:false,message:' No blog found'});
                }
                else{
                    res.json({success:true, blogs:blogs});
                }
            }
        }).sort({'_id':-1});
    });
   
    router.get('/singleBlog/:id',(req,res)=>{
        if(!req.params.id){
            res.json({success:false, message:'No blog ID was provided.'});
        }else{
            Blog.findOne({ _id:req.params.id},(err,blog) =>{
                if(err){
                    res.json({success:false,message:'Not valie blog id'});
                }else{
                    if(!blog){
                        res.json({ success:false, message:'Blog not found'});
                    }
                    else{
                        res.json({success:true,blog:blog});
                    }
                }
            });
        }
    });


    router.put('/updateBlog', (req,res)=>{
        if(!req.body._id){
            res.json({success:false,message:'No blog id  provided'});
        }
        else{
            Blog.findOne({_id:req.body._id},(err,blog)=>{
                if(err){
                    res.json({success:false,message:'Blog id wa not found'});
                }
                else{
                    if(!blog){
                        res.json({success:false,message:'Not a valid blog id'});
                    }else{
                        User.findOne({_id:req.decoded.userId},(err,user)=>{
                            if(err)
                                res.json({success:false,message:'Unable to authenticate userr.'});
                            else{
                                if(user.username!== blog.createdBy)
                                    res.json({success:false,message:'You are not authorized to edit this blog.'});
                                else{
                                    blog.title=req.body.title;
                                    blog.body=req.body.body;
                                    blog.save();
                                    if(err){
                                        res.json({success:false,message:err});
                                    }
                                    else{
                                        User.findOne({_id:req.decoded.userId},(err,user)=>{
                                            if(err){
                                                res.json({success:false,message:err})
                                            }else{
                                                if(!user){
                                                    res.json({success:false,message:'Unable to authenticate user'});
                                                }else{
                                                    if(user.username !==blog.createdBy){
                                                        res.json({success:false,message:'You are not authorized to edit this blog.'})
                                                    }else{
                                                        res.json({success:true,message:'Blog updated!'});
                                                    }
                                                }
                                            }
                                        });
                                       
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    router.delete('/deleteBlog/:id',(req,res)=>{
        if(!req.params.id){
            res.json({success:false,message:'No id provided'});
        }
        else{
            Blog.findOne({ _id:req.params.id},(err,blog)=>{
                if(err)
                    res.json({success:false,message:'Invalid id'});
                else{
                    if(!blog){
                        res.json({success:false,message:'Blog was not found'});
                    }else{
                        User.findOne({_id:req.decoded.userId},(err,user)=>{
                            if(err)
                                res.json({success:false,message:err});
                            else {
                                if(!user){
                                    res.json({success:false,message:'Unable to authenticate user.'});
                                }else{
                                    if(user.username!== blog.createdBy){
                                        res.json({success:false,message:'You are not authorized to delete this blog post'});
                                    }else{
                                        blog.remove((err)=>{
                                            if(err)
                                                res.json({success:false,message:err});
                                            else
                                                res.json({success:true,message:'Blog deleted successful!'});
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    router.put('/likeBlog', (req, res) => {
        // Check if id was passed provided in request body
        if (!req.body.id) {
          res.json({ success: false, message: 'No id was provided.' }); // Return error message
        } else {
          // Search the database with id
          Blog.findOne({ _id: req.body.id }, (err, blog) => {
            // Check if error was encountered
            if (err) {
              res.json({ success: false, message: 'Invalid blog id' }); // Return error message
            } else {
              // Check if id matched the id of a blog post in the database
              if (!blog) {
                res.json({ success: false, message: 'That blog was not found.' }); // Return error message
              } else {
                // Get data from user that is signed in
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                  // Check if error was found
                  if (err) {
                    res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                  } else {
                    // Check if id of user in session was found in the database
                    if (!user) {
                      res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                    } else {
                      // Check if user who liked post is the same user that originally created the blog post
                      if (user.username === blog.createdBy) {
                        res.json({ success: false, messagse: 'Cannot like your own post.' }); // Return error message
                      } else {
                        // Check if the user who liked the post has already liked the blog post before
                        if (blog.likedBy.includes(user.username)) {
                          res.json({ success: false, message: 'You already liked this post.' }); // Return error message
                        } else {
                          // Check if user who liked post has previously disliked a post
                          if (blog.dislikedBy.includes(user.username)) {
                            blog.dislikes--; // Reduce the total number of dislikes
                            const arrayIndex = blog.dislikedBy.indexOf(user.username); // Get the index of the username in the array for removal
                            blog.dislikedBy.splice(arrayIndex, 1); // Remove user from array
                            blog.likes++; // Increment likes
                            blog.likedBy.push(user.username); // Add username to the array of likedBy array
                            // Save blog post data
                            blog.save((err) => {
                              // Check if error was found
                              if (err) {
                                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                              } else {
                                res.json({ success: true, message: 'Blog liked!' }); // Return success message
                              }
                            });
                          } else {
                            blog.likes++; // Incriment likes
                            blog.likedBy.push(user.username); // Add liker's username into array of likedBy
                            // Save blog post
                            blog.save((err) => {
                              if (err) {
                                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                              } else {
                                res.json({ success: true, message: 'Blog liked!' }); // Return success message
                              }
                            });
                          }
                        }
                      }
                    }
                  }
                });
              }
            }
          });
        }
      });
    
      /* ===============================================================
         DISLIKE BLOG POST
      =============================================================== */
      router.put('/dislikeBlog', (req, res) => {
        // Check if id was provided inside the request body
        if (!req.body.id) {
          res.json({ success: false, message: 'No id was provided.' }); // Return error message
        } else {
          // Search database for blog post using the id
          Blog.findOne({ _id: req.body.id }, (err, blog) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: 'Invalid blog id' }); // Return error message
            } else {
              // Check if blog post with the id was found in the database
              if (!blog) {
                res.json({ success: false, message: 'That blog was not found.' }); // Return error message
              } else {
                // Get data of user who is logged in
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                  // Check if error was found
                  if (err) {
                    res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                  } else {
                    // Check if user was found in the database
                    if (!user) {
                      res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                    } else {
                      // Check if user who disliekd post is the same person who originated the blog post
                      if (user.username === blog.createdBy) {
                        res.json({ success: false, messagse: 'Cannot dislike your own post.' }); // Return error message
                      } else {
                        // Check if user who disliked post has already disliked it before
                        if (blog.dislikedBy.includes(user.username)) {
                          res.json({ success: false, message: 'You already disliked this post.' }); // Return error message
                        } else {
                          // Check if user has previous disliked this post
                          if (blog.likedBy.includes(user.username)) {
                            blog.likes--; // Decrease likes by one
                            const arrayIndex = blog.likedBy.indexOf(user.username); // Check where username is inside of the array
                            blog.likedBy.splice(arrayIndex, 1); // Remove username from index
                            blog.dislikes++; // Increase dislikeds by one
                            blog.dislikedBy.push(user.username); // Add username to list of dislikers
                            // Save blog data
                            blog.save((err) => {
                              // Check if error was found
                              if (err) {
                                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                              } else {
                                res.json({ success: true, message: 'Blog disliked!' }); // Return success message
                              }
                            });
                          } else {
                            blog.dislikes++; // Increase likes by one
                            blog.dislikedBy.push(user.username); // Add username to list of likers
                            // Save blog data
                            blog.save((err) => {
                              // Check if error was found
                              if (err) {
                                res.json({ success: false, message: 'Something went wrong.' }); 
                              } else {
                                res.json({ success: true, message: 'Blog disliked!' }); 
                              }
                            });
                          }
                        }
                      }
                    }
                  }
                });
              }
            }
          });
        }
      });

      router.post('/comment', (req, res) => {
        // Check if comment was provided in request body
        if (!req.body.comment) {
          res.json({ success: false, message: 'No comment provided' }); // Return error message
        } else {
          // Check if id was provided in request body
          if (!req.body.id) {
            res.json({ success: false, message: 'No id was provided' }); // Return error message
          } else {
            // Use id to search for blog post in database
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Invalid blog id' }); // Return error message
              } else {
                // Check if id matched the id of any blog post in the database
                if (!blog) {
                  res.json({ success: false, message: 'Blog not found.' }); // Return error message
                } else {
                  // Grab data of user that is logged in
                  User.findOne({ _id: req.decoded.userId }, (err, user) => {
                    // Check if error was found
                    if (err) {
                      res.json({ success: false, message: 'Something went wrong' }); // Return error message
                    } else {
                      // Check if user was found in the database
                      if (!user) {
                        res.json({ success: false, message: 'User not found.' }); // Return error message
                      } else {
                        // Add the new comment to the blog post's array
                        blog.comments.push({
                          comment: req.body.comment, // Comment field
                          commentator: user.username // Person who commented
                        });
                        // Save blog post
                        blog.save((err) => {
                          // Check if error was found
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Comment saved' }); // Return success message
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    
      
    
    return router;
}
