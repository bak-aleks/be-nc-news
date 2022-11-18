const { selectTopics, selectArticles, selectArticleById, selectCommentsByArticleId, insertComment, updateArticles, selectUsers, removeComment} = require("../models/news")
const endpoints = require('../endpoints.json')

exports.getTopics = (req, res, next)=>{
    selectTopics().then((topics)=>{
        res.status(200).send({topics:topics})
    })
    .catch(next)
}

exports.getArticleById = (req, res, next)=>{
    const { article_id } = req.params;
    selectArticleById(article_id)
    .then((article)=>{
        res.status(200).send({article});
    })
    .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    selectCommentsByArticleId(article_id)
    .then((comments)=>{
        res.status(200).send({comments})
    })
    .catch(next)
};

exports.postComment = (req, res, next)=>{
    const {article_id} = req.params;
    const {username, body} = req.body;
    insertComment(article_id, username, body).then((comment)=>{
        res.status(201).send({comment})
    })
    .catch(next)
};

exports.patchArticleById = (req, res, next) =>{
    const {article_id} = req.params;
    const {inc_votes} = req.body;
    updateArticles(article_id, inc_votes).then((article)=>{
        res.status(200).send({article})
    })
    .catch(next)
}
exports.getUsers = (req, res, next)=>{
    selectUsers().then((users)=>{
        res.status(200).send({users})
    })
    .catch(next)
}
exports.getArticles = (req, res, next)=>{
    const {sort_by, order, chosen_topic} = req.query
    selectArticles(sort_by, order, chosen_topic).then((articles)=>{
        res.status(200).send({articles})
    })
    .catch(next)
}
exports.deleteComment = (req, res, next)=>{
    const{comment_id} = req.params;
    removeComment(comment_id).then(()=>res.send(204).send())
    .catch(next)
}
exports.getEndPoints = (req, res, next) =>{
    res.status(200).send({msg:endpoints})
    .catch(next)
}