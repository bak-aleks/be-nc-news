const { selectTopics, selectArticles, selectArticleById, selectCommentsByArticleId, insertComment} = require("../models/news")

exports.getTopics = (req, res, next)=>{
    selectTopics().then((topics)=>{
        res.status(200).send({topics:topics})
    })
    .catch(next)
}

exports.getArticles = (req, res, next)=>{
    const {sort_by, order} = req.query
    selectArticles(sort_by, order).then((articles)=>{
        res.status(200).send({articles:articles})
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