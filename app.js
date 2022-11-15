const express = require('express')
const app = express()
const {getTopics, getArticles} = require('./controllers/news')

app.use(express.json());
app.use((err, req, res, next)=>{
    if(err.status && err.msg){
        res.status(err.status).send({msg:err.msg})
    }else if(err.code ==='22P02'){
        res.status(400).send({msg:'Bad Request'})
    }else res.send(500).send({msg:'Internal Server Error'})
})

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.get("*", function(req, res){
    res.status(404).send({msg:"Route does not exist"});
});

module.exports = app;