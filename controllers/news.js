const { selectTopics, selectArticles } = require("../models/news")

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