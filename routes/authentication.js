const User=require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const multer = require('multer');
/*
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');
*/


var store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './uploads');
    },
    filename:function(req,file,cb){
        cb(null, Date.now()+'.'+file.originalname);
    }
});

var upload = multer({storage:store}).single('file');

module.exports=(router)=>{

    router.post('/register',(req,res) =>{
        if(!req.body.email)
            res.json({success:false,message:"You must provide an e-mail"});
        else{
            if(!req.body.username)
                res.json({success:false,message:"You must provide an username"});   
            else{
                if(!req.body.password)
                    res.json({success:false,message:"You must provide an password"})
                else{
                    if(!req.body.firstName)
                        res.json({success:false,message:"You must provide an fist name"});
                    else{
                        if(!req.body.lastName)
                            res.json({success:false,message:"You must provide an last name"})
                        else{
                            let user= new User({
                                firstName:req.body.firstName,
                                lastName:req.body.lastName,
                                email: req.body.email.toLowerCase(),
                                username: req.body.username.toLowerCase(),
                                password: req.body.password,
                                imageProfile:req.body.imageProfile
                            });
                            console.log(JSON.stringify(user));
                            user.save((err)=>{
                            if(err){
                                console.log(err);
                                if(err.code ===11000){
                                    res.json({success:false,message:"Username or e-mail already exists"});
                                }else{
                                    if(err.errors){
                                        if(err.errors.email){
                                            res.json({success:false,message:err.errors.email.message});
                                        }
                                        else if(err.errors.username){
                                            res.json({success:false,message:err.errors.username.message});
                                        }
                                        else if(err.errors.password){
                                            res.json({success:false,message:err.errors.password.message});
                                        }
                                    }
                                    else{  
                                        res.json({success:false,message:"Could not save user. Error: ",err});
                                        }
                                    
                                }
                            }else{
                                res.json({success:true,message:"User success saved"});
                            }
                        });
                    }
                }
        
            }
        }
    }
});

    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) {
          res.json({ success: false, message: 'E-mail was not provided' }); 
        } else {
          User.findOne({ email: req.params.email }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); 
            } else {
              if (user) {
                res.json({ success: false, message: 'E-mail is already taken' });
              } else {
                res.json({ success: true, message: 'E-mail is available' });
              }
            }
          });
        }
      });
    
      router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) {
          res.json({ success: false, message: 'Username was not provided' });
        } else {
          User.findOne({ username: req.params.username }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); 
            } else {
              if (user) {
                res.json({ success: false, message: 'Username is already taken' }); 
              } else {
                res.json({ success: true, message: 'Username is available' });
              }
            }
          });
        }
      });

    router.post('/login',(req,res)=>{
        if(!req.body.username){
            res.json({success:false,message:'You must provide an username'});
        }
        else{
            if(!req.body.password){
                res.json({success:false,message:'Tou must provide an password'});
            }
            else{
                User.findOne({username:req.body.username.toLowerCase() },(err,user)=>{
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                        if(!user){
                            res.json({success:false,message:'Username not found'});
                        }else{
                            const validPassword = user.comparePassword(req.body.password);
                            if (!validPassword) {
                              res.json({ success: false, message: 'Password invalid' }); 
                            } else {
                              const token=jwt.sign({userId:user._id},config.secret, {expiresIn:'24h'});
                              res.json({ success: true, message: 'Success!', token:token, user:{ username: user.username }}); 
                            }
                        }
                    }
                });
            }
        }
    });

    router.use((req,res,next) =>{
        const token = req.headers['authorization'];
        if(!token){
            res.json({success:false,message:'No token provided'});
        }
        else{
            jwt.verify(token, config.secret,(err,decoded)=>{
                if(err){
                    res.json({success:false, message:'Token invalid: '+ err});
                }else{
                    req.decoded=decoded;
                    next();
                }
            })
        }
    });

    router.get('/profile',(req,res)=>{
        User.findOne({ _id: req.decoded.userId }).select('firstName lastName username email').exec((err,user)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(!user){
                    res.json({ success:false, message:'User not found'});
                }
                else{
                    res.json({success:true,user:user});
                }
            }
        });
    });

    router.get('/publicProfile/:username', (req, res) => {
        console.log(req.params.username);
        // Check if username was passed in the parameters
        if (!req.params.username) {
          res.json({ success: false, message: 'No username was provided' }); // Return error message
        } else {
          // Check the database for username
          User.findOne({ username: req.params.username }).select('username email').exec((err, user) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: 'Something went wrong.' }); // Return error message
            } else {
              // Check if user was found in the database
              if (!user) {
                res.json({ success: false, message: 'Username not found.' }); // Return error message
              } else {
                res.json({ success: true, user: user }); 
                console.log(JSON.stringify(user));// Return the public user's profile data
              }
            }
          });
        }
      });
 /*   
    router.put('/profileImage:imagePath',(req,res) =>{
        if(!req.body){
            res.json({success:false,message:'We have a problem boss'});
        }
        else{
            User.findOne({_id:req.decoded.userId},(err,user)=>{
                if(err)
                    res.json({success:false,message:'Something went wrong.'});
                else{
                    if(!user){
                        res.json({ success: false, message: 'Could not authenticate user.' });
                    }else{
                        user.imageProfile=req.body.imageProfile;
                        user.save((err)=>{
                            if(err)
                                res.json({success:false,message:'Something went wrong.'});
                            else
                                res.json({success:true,message:'Image updated'});
                        })
                    }
                }
            })
        }
    });

*/
/*
router.post('/profileImage',function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.end(err.toString());
        }
            res.end('File is uploaded');
        });
    });

    */
/*
   router.post("/profileImage", multer({dest: "./uploads/"}).array("uploads", 12), function(req, res) {
        res.send(req.files);
    });

    */
   router.post('/profileImage', function(req,res,next){
    upload(req,res,function(err){
        if(err){
            return res.status(501).json({error:err});
        }
        //do all database record saving activity
        return res.json({originalname:req.file.originalname, uploadname:req.file.filename});
    });
})
    /*
      router.post('/profileImage',function(req, res,err) {
          upload(function(req,res,err){
            if(err){
                 res.json({error_code:1,message:err.errors});
                //res.json({success:false,message:'Dogodila se greska'});
                return;
            }
            res.json({error_code:0,err_desc:null});
        });
    });
    */
    return router;
}