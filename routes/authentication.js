const User=require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const multer = require('multer');

var store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './client/src/assets/img');
    },
    filename:function(req,file,cb){
        cb(null, Date.now()+'.'+file.originalname);
    }
});

var upload = multer({storage:store}).single('file');

module.exports=(router)=>{

    router.post('/register',(req,res) =>{
        if(!req.body.email)
            res.json({success:false,message:"E-mail nije prosleđen"});
        else{
            if(!req.body.username)
                res.json({success:false,message:"Korisničko ime nije prosleđeno"});   
            else{
                if(!req.body.password)
                    res.json({success:false,message:"Llozinka nije prosleđena"})
                else{
                    if(!req.body.firstName)
                        res.json({success:false,message:"Ime nije prosleđeno"});
                    else{
                        if(!req.body.lastName)
                            res.json({success:false,message:"Prezime nije prosleđeno"})
                        else{
                            if(!req.body.gender)
                                res.json({success:false,message:"Pol nije prosleđen"})
                            else{
                                let user= new User({
                                    firstName:req.body.firstName,
                                    lastName:req.body.lastName,
                                    email: req.body.email.toLowerCase(),
                                    username: req.body.username.toLowerCase(),
                                    password: req.body.password,
                                    gender:req.body.gender,
                                    imageProfile:req.body.imageProfile
                                });
                                console.log(JSON.stringify(user));
                                user.save((err)=>{
                                if(err){
                                    if(err.code ===11000){
                                        res.json({success:false,message:"Korisničko ime ili E-mail već postoje"});
                                    }else{
                                        if(err.errors){
                                            if(err.errors.email)
                                                res.json({success:false,message:err.errors.email.message});

                                            else if(err.errors.username)
                                                res.json({success:false,message:err.errors.username.message});

                                            else if(err.errors.password)
                                                res.json({success:false,message:err.errors.password.message});
                                            
                                        }
                                        else 
                                            res.json({success:false,message:"Ne možeš da sačuvas korisnika. Error: ",err});  
                                    }
                                }else
                                    res.json({success:true,message:"Korisnik je uspešno registrovan"});
                            });
                        }
                    }
                }
            }
        }
    }
});

    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) {
          res.json({ success: false, message: 'E-mail nije prosleđen' }); 
        } else {
            User.findOne({ email: req.params.email }, (err, user) => {
                if (err) 
                    res.json({ success: false, message: err }); 
                else {
                    if (user) 
                        res.json({ success: false, message: 'E-mail je zauzet' });
                    else 
                        res.json({ success: true, message: 'E-mail je dostupan' });
              
                }
            });
        }
    });
    
    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) 
            res.json({ success: false, message: 'Korisnikčko ime nije prosleđeno' });
        else {
            User.findOne({ username: req.params.username }, (err, user) => {
                if (err) 
                    res.json({ success: false, message: err }); 
                else {
                    if (user) 
                        res.json({ success: false, message: 'Korisničko ime je zauzeto' }); 
                    else 
                        res.json({ success: true, message: 'Korisničko ime je dostupno' });
              
                }
            });
        }
    });

    router.post('/login',(req,res)=>{
        if(!req.body.username)
            res.json({success:false,message:'Korisničko ime nije prosleđeno'});
        else{
            if(!req.body.password)
                res.json({success:false,message:'Lozinka nije posleđena'});
            else{
                User.findOne({username:req.body.username.toLowerCase() },(err,user)=>{
                    if(err)
                        res.json({success:false,message:err});
                    else{
                        if(!user)
                            res.json({success:false,message:'Korisničko ne postoji'});
                        else{
                            const validPassword = user.comparePassword(req.body.password);
                            if (!validPassword) 
                                res.json({ success: false, message: 'Lozinka je neispravna' }); 
                            else {
                                const token=jwt.sign({userId:user._id},config.secret, {expiresIn:'1h'});
                                res.json({ success: true, message: 'Korisnik je prijavljen!', token:token, user:{ username: user.username }}); 
                            }
                        }
                    }
                });
            }
        }
    });

    router.use((req,res,next) =>{
        const token = req.headers['authorization'];
        if(!token)
            res.json({success:false,message:'Token nije prosleđen'});
        else{
            jwt.verify(token, config.secret,(err,decoded)=>{
                if(err)
                    res.json({success:false, message:'Token nije ispravan: '+ err});
                else{
                    req.decoded=decoded;
                    next();
                }
            });
        }
    });

    router.get('/profile',(req,res)=>{
        User.findOne({ _id: req.decoded.userId }).select('firstName lastName username email imageProfile').exec((err,user)=>{
            if(err)
                res.json({success:false,message:err});
            else{
                if(!user)
                    res.json({ success:false, message:'Korisnik nije pronađen'});
                else
                    res.json({success:true,user:user});
            }
        });
    });

    router.get('/publicProfile/:username', (req, res) => {
        console.log(req.params.username);
        if (!req.params.username) 
            res.json({ success: false, message: 'Korisničko ime nije prosleđeno' }); 
        else {
            User.findOne({ username: req.params.username }).select('firstName lastName username email imageProfile').exec((err, user) => {
            if (err)
                res.json({ success: false, message: 'Greška.' }); 
            else {
                if (!user) 
                    res.json({ success: false, message: 'Korisničko ime ne postoji.' }); 
                else {
                    res.json({ success: true, user: user }); 
                    console.log(JSON.stringify(user));
                }
            }
          });
        }
      });

    router.post('/profileImage', function(req,res,next){
        upload(req,res,function(err){
            if(err)
                return res.status(501).json({error:err});
            else{
                const token = req.headers['authorization'];
                var decoded = jwt.decode(token);
                console.log( decoded );
                const path = 'assets/img/'+req.file.filename;
                console.log(path);
                
                User.update({ _id:decoded.userId}, 
                            {$set:{imageProfile:path}}).exec();

                return res.json({originalname:req.file.originalname, uploadname:req.file.filename});
            }
           
        });
        
    });


    return router;
}