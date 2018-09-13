const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

let titleLenghtChecker =(title)=>{
    if(!title)
        return false;
    else{
        if(title.length<5|| title.length>50)
            return false
    
        else
            return true;
    }
}

let alphaNumericTitleChecker = (title) =>{
    if(!title)
        return false;
    else{
        const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(title);
    }
}



let  bodyLenghtChecker=(body)=>{
    if(!body)
        return false;
    else{
        if(body.length<5 || body.length>500)
            return false;

        else
            return true;
    }
}


let commentLengthChecker = (comment)=>{
    if(!comment[0])
        return false;
    else{
        if(comment[0].length<1 || comment[0].length>200)
            return false;
        else
            return true;
    }
}

let titleValidators = [
    { validator: titleLenghtChecker, message:'Title must be at least 5 characters but no more then 50'},
    { validator: alphaNumericTitleChecker, message:'Must be a text'}
];

let bodyValidators = [
    { validator:bodyLenghtChecker,message:'Username must be at least 5 characters but no more then 500'}
];

let commentValidators =[
    { validator:commentLengthChecker,message:'comments may not exceed 200 characters.'}
    
];

const blogSchema=new Schema({
    title:{type: String,required:true,validate:titleValidators},
    body:{ type:String,required:true,validate:bodyValidators},
    createdBy:{ type:String},
    createdAt:{ type:Date, default:Date.now()},
    likes:{type:Number,default:0},
    likedBy:{type:Array},
    dislikes:{type:Number,default:0},
    dislikedBy:{type:Array},
    comments:[
        {
            comment:{type:String,validate:commentValidators},
            commentator:{type:String}
        }
    ]
});

module.exports= mongoose.model('Blog',blogSchema);