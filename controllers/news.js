const { selectTopics } = require("../models/news")

exports.getTopics = (req, res, next)=>{
    selectTopics().then((topics)=>{
        res.status(200).send({topics:topics})
    })
    .catch(next)
}