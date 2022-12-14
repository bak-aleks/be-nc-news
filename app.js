const express = require('express')
const app = express()
const {getTopics, getArticles, getArticleById, getCommentsByArticleId, postComment, patchArticleById, getUsers, deleteComment, getEndPoints} = require('./controllers/news')

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postComment);
app.patch('/api/articles/:article_id', patchArticleById);
app.get('/api/users', getUsers);
app.delete('/api/comments/:comment_id', deleteComment);
app.get('/api', getEndPoints);

app.use((err, req, res, next)=>{
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }else if(err.code ==='22P02'){
        res.status(400).send({msg:'Invalid id'})
    }else {
        console.log(err)
        res.status(500).send({msg:'Internal Server Error'})
    }  
})

app.get("*", function(req, res){
    res.status(404).send({msg:"Route does not exist"});
});

module.exports = app;