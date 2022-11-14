const express = require('express')
const app = express()
const {getTopics} = require('./controllers/news')

app.use(express.json());
app.get('/api/topics', getTopics);

app.get('*', function(req, res){
    res.send(404).send({msg:'Route does not exist'});
});

module.exports = app;