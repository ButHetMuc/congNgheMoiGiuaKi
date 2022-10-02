const express = require('express');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const app = express();

const upload = multer();
const table = 'country'

const config = new AWS.Config({
    accessKeyId: 'AKIA5LHV54SWPUO6XWL5',
    secretAccessKey: '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',
    region: 'ap-southeast-1',
})

AWS.config = config;
const docClient = new AWS.DynamoDB.DocumentClient();


app.use(cors());
app.use(express.json({extend: false}));
app.use(express.static('./views'));
app.set('view engine','ejs');
app.set('views', './views');


app.post('/delete',upload.fields([]),(req,res)=>{
    console.log(req.body);
    const {id} = req.body;
    const params = {
        TableName: table,
        Key:{
            id,
        }
    }
    docClient.delete(params,(err,data) =>{
        if(err){
            return res.status(500).json(err);
        }else{
            return res.redirect('/');
        }
    })
});
app.get('/post',(req,res) =>{
    return res.render('post');
})

app.get('/',(req,res) => {
    const params = {
        TableName : table,
    }
    docClient.scan(params,(err,data) => {
        if(err){
           return res.status(500).json(err);
        }else{
            return res.render('index', {country : data.Items});
        }
    })
})

app.post('/',upload.fields([]),(req,res) =>{
    const {id,name,nation} = req.body;
    const params = {
        TableName: table,
        Item: {
            id,
            name,
            nation,
        }
    }
    docClient.put(params,(err,data) =>{
        if(err){
          return  res.status(500).json(err);
        }else{
            return res.redirect('/');
        }
    })
})


app.listen(9000,()=>{
    console.log('server is running');
});
