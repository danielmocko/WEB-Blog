const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const router=express.Router();
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');
const cors = require('cors');
const blogs = require('./routes/blogs')(router);

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err)=>{
    if(err)
        console.log('Could NOT connect to database: ',err);
    else{
        console.log('Connected to database: ',config.db);
    }
});


app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//for building appplication and nested angular in node, just start app with node start or nodemon index.js
//app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication',authentication);
app.use('/blogs',blogs);
/*
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});*/

app.listen(8080, () =>{
    console.log('Listening on port 8080');
});