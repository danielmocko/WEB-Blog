const User=require('../models/user');
const Blog = require('../models/blog');

module.exports = (router)=>{
    
    router.post('/newBlog',(req,res)=>{
        console.log(JSON.stringify(req.body.title));
        if(!req.body.title){
            res.json({success:false,message:'Naslov bloga nije porsleđen'});
        }
        else{
            if(!req.body.body){
                res.json({success:false,message:'Tekst bloga nije prosleđen.'});
            }
            else{
                if(!req.body.createdBy){
                    res.json({ success:false,message:'Pisac bloga nije prosleđen'});
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
                            res.json({success:true,message:"Blog je kreiran!"});
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
                    res.json({success:false,message:'Blog ne postoji'});
                }
                else{
                    res.json({success:true, blogs:blogs});
                }
            }
        }).sort({'_id':-1});
    });
   
    router.get('/singleBlog/:id',(req,res)=>{
        if(!req.params.id){
            res.json({success:false, message:'Blog ID nije prosleđen'});
        }else{
            Blog.findOne({ _id:req.params.id},(err,blog) =>{
                if(err){
                    res.json({success:false,message:'Blog ID nije dobar'});
                }else{
                    if(!blog){
                        res.json({ success:false, message:'Blog nije pronađen'});
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
            res.json({success:false,message:'Blog ID nije prosleđen'});
        }
        else{
            Blog.findOne({_id:req.body._id},(err,blog)=>{
                if(err){
                    res.json({success:false,message:'Blog ID nije pronađen'});
                }
                else{
                    if(!blog){
                        res.json({success:false,message:'Blog ID je neispravan'});
                    }else{
                        User.findOne({_id:req.decoded.userId},(err,user)=>{
                            if(err)
                                res.json({success:false,message:'Nemoguće je pronaći korisnika'});
                            else{
                                console.log(JSON.stringify(user));
                                if(user.username!== blog.createdBy)
                                    res.json({success:false,message:'Niste ovlašćeni da vršite izmene nad blogom.'});
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
                                                    res.json({success:false,message:'Nemoguće je identifikovati korisnika'});
                                                }else{
                                                    if(user.username !==blog.createdBy){
                                                        res.json({success:false,message:'Niste ovlašćeni da vršite izmene nad blogom.'})
                                                    }else{
                                                        res.json({success:true,message:'Blog je izmenjen!'});
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
            res.json({success:false,message:'Blog ID nije prosleđen'});
        }
        else{
            Blog.findOne({ _id:req.params.id},(err,blog)=>{
                if(err)
                    res.json({success:false,message:'Blog ID nije dobar'});
                else{
                    if(!blog){
                        res.json({success:false,message:'Blog ID nije pronađen'});
                    }else{
                        User.findOne({_id:req.decoded.userId},(err,user)=>{
                            if(err)
                                res.json({success:false,message:err});
                            else {
                                if(!user){
                                    res.json({success:false,message:'Korisnik nije pronađen.'});
                                }else{
                                        blog.remove((err)=>{
                                            if(err)
                                                res.json({success:false,message:err});
                                            else
                                                res.json({success:true,message:'Blog je obrisan'});
                                        });
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    router.put('/likeBlog', (req, res) => {
      
        if (!req.body.id) {
          res.json({ success: false, message: 'Blog ID nije prosleđen'}); 
        } else {
          Blog.findOne({ _id: req.body.id }, (err, blog) => {
            if (err) 
                res.json({ success: false, message: 'Blog ID nije ispravan' }); 
            else {
                if (!blog) 
                    res.json({ success: false, message: 'Blog ID nije pronađen' });
                else {
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                    if (err)
                        res.json({ success: false, message: 'Greška.' }); 
                    else {
                        if (!user) 
                            res.json({ success: false, message: 'Korisnik nije ispravan' }); 
                        else {
                      if (user.username === blog.createdBy) {
                        res.json({ success: false, messagse: 'Ne možeš lajkovati sopstveni blog.' }); 
                      } else {
                        if (blog.likedBy.includes(user.username)) {
                          res.json({ success: false, message: 'Ovaj blog je već lajkovan.' }); 
                        } else {
                          if (blog.dislikedBy.includes(user.username)) {
                            blog.dislikes--;
                            const arrayIndex = blog.dislikedBy.indexOf(user.username); 
                            blog.dislikedBy.splice(arrayIndex, 1); 
                            blog.likes++; 
                            blog.likedBy.push(user.username); 

                            blog.save((err) => {
                              if (err) {
                                res.json({ success: false, message: 'Greška prilikom izmene.' }); 
                              } else {
                                res.json({ success: true, message: 'Blog je lajkovan!' }); 
                              }
                            });
                          } else {
                            blog.likes++; 
                            blog.likedBy.push(user.username); 
                           
                            blog.save((err) => {
                              if (err) {
                                res.json({ success: false, message: 'Greška prilikom izmene.' }); 
                              } else {
                                res.json({ success: true, message: 'Blog je lajkovan!' }); 
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
    
      router.put('/dislikeBlog', (req, res) => {
      
        if (!req.body.id)
          res.json({ success: false, message: 'Blog ID nije prosleđen.' });
        else {
         
          Blog.findOne({ _id: req.body.id }, (err, blog) => {
         
            if (err) {
              res.json({ success: false, message: 'Blog ID nije ispravan' });
            } else {
             
              if (!blog) {
                res.json({ success: false, message: 'Blog ID nije pronađen.' });
              } else {
               
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
              
                  if (err) {
                    res.json({ success: false, message: 'Greška.' }); 
                  } else {
                    if (!user) {
                      res.json({ success: false, message: 'Korisnik nije pronađen.' }); 
                    } else {
                      if (user.username === blog.createdBy) {
                        res.json({ success: false, messagse: 'Ne možes da dislajkuješ sopstveni diskusiju.' });
                      } else {
                        if (blog.dislikedBy.includes(user.username)) {
                          res.json({ success: false, message: 'Već si dislajkovao diskusiju.' });
                        } else {
                          if (blog.likedBy.includes(user.username)) {
                            blog.likes--;
                            const arrayIndex = blog.likedBy.indexOf(user.username); 
                            blog.likedBy.splice(arrayIndex, 1); 
                            blog.dislikes++;
                            blog.dislikedBy.push(user.username);
                       
                            blog.save((err) => {
                          
                              if (err) {
                                res.json({ success: false, message: 'Gerška prilikom izmene.' }); 
                              } else {
                                res.json({ success: true, message: 'Blog je dislajkovan!' });
                              }
                            });
                          } else {
                            blog.dislikes++;
                            blog.dislikedBy.push(user.username);

                            blog.save((err) => {
                              if (err) {
                                res.json({ success: false, message: 'Greška prilikom izmene.' }); 
                              } else {
                                res.json({ success: true, message: 'Blog je dislajkovan!' }); 
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
       
        if (!req.body.comment) {
          res.json({ success: false, message: 'Komentar nije prosleđen' });
        } else {
          if (!req.body.id) {
            res.json({ success: false, message: 'ID komentara nije prosleđen' }); 
          } else {
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
                
              if (err) {
                res.json({ success: false, message: 'Blog ID nije ispravan' }); 
              } else {
               
                if (!blog) {
                  res.json({ success: false, message: 'Blog ID nije pronađen.' });
                } else {
                  User.findOne({ _id: req.decoded.userId }, (err, user) => {
                    if (err) {
                      res.json({ success: false, message: 'Greška!' }); 
                    } else {
                      if (!user) {
                        res.json({ success: false, message: 'Korisnik nije pronađen.' });
                      } else {
                        blog.comments.push({
                          comment: req.body.comment, 
                          commentator: user.username 
                        });
                        blog.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Greška prilikom čuvanja.' }); 
                          } else {
                            res.json({ success: true, message: 'KOmentar je sačuvan' }); 
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
