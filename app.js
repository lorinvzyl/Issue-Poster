const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const express = require('express')
const app = express()
const urlprefix = "/api"
const mongoose = require('mongoose')
const fs = require('fs')
const cert = fs.readFileSync('keys/certificate.pem');
const options = {
    server: {sslCA: cert}
};
const cors = require('cors');
const connstring = 'mongodb+srv://admin:YmeEOtPIvcSN1l4u@cluster0.i4icsey.mongodb.net/?retryWrites=true&w=majority';

var ExpressBrute = require('express-brute');
var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

const postRoutes = require('./routes/post')
const userRoutes  = require('./routes/user')

mongoose.connect(connstring)
.then(()=>
{
    console.log('Connected')
})
.catch(() =>
{
    console.log('Not connected')
}, options);

app.use(helmet(
    {
        crossOriginResourcePolicy: false
    }))

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}))

app.use(express.json())

app.use(cors())

app.use((reg,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
});

app.get(urlprefix+'/', (req,res) => {
    res.send('Hello World Express');
})

app.set('trust proxy', 1)
app.post('/auth', bruteforce.prevent, 
    function (req, res, next) {
        res.send('Success!');
    })

app.use(urlprefix+'/posts', postRoutes)
app.use(urlprefix+'/users', userRoutes)

module.exports = app;