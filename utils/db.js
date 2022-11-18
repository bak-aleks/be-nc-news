const db  = require('../db/connection');

exports.checkArticleExists = (article_id)=>{
    return db
    .query(
        `SELECT * FROM articles
        WHERE article_id = $1`
    , [article_id])
    .then((response)=>{
        if(response.rows.length===0){
            return Promise.reject({status:404, msg:'Article not found'})
        }
    })
}
exports.checkCommentExists = (comment_id)=>{
    return db
    .query(
        `SELECT * FROM comments
        WHERE comment_id = $1`
    , [comment_id])
    .then((response)=>{
        if(response.rows.length===0){
            return Promise.reject({status:404, msg:'Comment not found'})
        }
    })
}