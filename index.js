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
var cookieParser = require('cookie-parser');
const port =  8080;


mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err)=>{
    if(err)
        console.log('Could NOT connect to database: ',err);
    else{
        console.log('Connected to database: ',config.db);
    }
});

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.static(__dirname + '/client/dist/client'));
app.use('/authentication',authentication);
app.use('/blogs',blogs);
app.use(express.static(__dirname + '/public'));


app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/client/dist/client/index.html'));
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
  });