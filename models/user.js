const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt-nodejs');

let firstNameChecker = (firstName) =>{
    if(!firstName)
        return false;
    else{
        if(firstName.length<2 || firstName.length>30)
            return false;
        else
            return true;
    }
}

let validFirstName = (firstName)=>{
    if(!firstName)
        return false;
    else{
        const regExp = new RegExp(/^[A-Z][a-z0-9_-]{3,19}$/);
        return regExp.test(firstName);
    }
}

let lastNameChecker = (lastName) =>{
    if(!lastName)
        return false;
    else{
        if(lastName.length<2 || lastName.length>30)
            return false;
        else
            return true;
    }
}

let validLastName = (lastName)=>{
    if(!lastName)
        return false;
    else{
        const regExp = new RegExp(/^[A-Z][a-z0-9_-]{3,19}$/);
        return regExp.test(lastName);
    }
}

let emailLenghtChecker =(email)=>{
    if(!email)
        return false;
    else{
        if(email.length<5||email.length>30)
            return false
    
        else
            return true;
    }
}

let validEmailChecker = (email) =>{
    if(!email)
        return false;
    else{
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}



let  usernameLenghtChecker=(username)=>{
    if(!username)
        return false;
    else{
        if(username<3 || username>30)
            return false;

        else
            return true;
    }
}

let validUsernameChecker=(username)=>{
    if(!username)
        return false;
    else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
}

let passwordLengthChecker = (password)=>{
    if(!password)
        return false;
    else{
        if(password.length<8 || password.length>35)
            return false;
        else
            return true;
    }
}

let validPasswordChecker = (password)=>{
    if(!password)
        return false;
    else{

    }
}

let firstNameValidators = [
    { validator:firstNameChecker,message:'First name must be at least 2 characters but no more than 30'},
    { validator:validFirstName,message:'Must be a valid first name'}
];

let lastNameValidators=[
    {validator:lastNameChecker,message:'Last name must be at least 2 characters but no more than 30'},
    { validator:validLastName,message:'Must be a valid last name'}
];

let emailValidators = [
    { validator:emailLenghtChecker, message:'E-mail must be at least 5 characters but no more then 30'},
    { validator:validEmailChecker, message:'Must be a valid e-mail'}
];

let usernameValidators = [
    { validator:usernameLenghtChecker,message:'Username must be at least 3 characters but no more then 30'},
    { validator: validUsernameChecker,message:'Must be valid username'}
];

let passwordValidators =[
    { validator:passwordLengthChecker,message:'Username must be at least 8 characters but no more then 30'},
    { validator:validPasswordChecker,message:'Must be valid password'}
];


const userSchema = new Schema({
    firstName:{type:String,require:true,validate:firstNameValidators},
    lastName:{type:String,require:true,validate:lastNameValidators},
    email:{type:String,require:true,unique:true,lowercase:true,validate:emailValidators},
    username:{type:String,require:true,unique:true,lowercase:true,validate:usernameValidators},
    password:{type:String,require:true,validate:passwordValidators},
    imageProfile:{type:String}
});

userSchema.pre('save', function(next) {
    // Ensure password is new or modified before applying encryption
    if (!this.isModified('password'))
      return next();
  
    // Apply encryption
    bcrypt.hash(this.password, null, null, (err, hash) => {
      if (err) 
        return next(err); // Ensure no errors

      console.log(this.password);
      this.password = hash; // Apply encryption to password
      next(); // Exit middleware
    });
  });

userSchema.methods.comparePassword = function(password){
    console.log(password);
    return bcrypt.compareSync(password, this.password);
  };

module.exports= mongoose.model('User',userSchema);