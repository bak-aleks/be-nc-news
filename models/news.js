const db = require('../db/connection')
const{checkArticleExists} = require('../utils/db.js')

exports.selectTopics = ()=>{
    return db.query("SELECT * FROM topics;").then((result)=>result.rows);
}

exports.selectArticles = (sort_by = 'created_at', order='DESC') =>{   
    let queryStr = `SELECT articles.author, articles.title, articles.topic, articles.article_id, articles.created_at, articles.votes, COUNT(comments.article_id)::int AS comment_count 
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    GROUP BY articles.article_id` 

    queryStr +=` ORDER BY ${sort_by} ${order};`

    return db.query(queryStr).then((result)=>{
        return result.rows
    })
}
exports.selectArticleById = (article_id) =>{
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result)=>{
        if(result.rows.length === 0){
            return Promise.reject({status:404, msg:'Article does not exist'
            })
        }
        return result.rows[0]
    })
};

exports.selectCommentsByArticleId = (article_id) =>{
    return checkArticleExists(article_id)
    .then(()=>{
        return db
    .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
    })
    .then((response)=>{
        return response.rows;
    }) 
};

exports.insertComment = (article_id, username, body) =>{
    return checkArticleExists(article_id).then(()=>{
        if(!body || !username || typeof username !== "string"){
        return Promise.reject({
            status:400,
            msg:'Bad Request'
        })}
        return db
        .query(`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`, [article_id, username, body])
        .then((result)=>{
        const comment = result.rows[0]
        return comment
    })
    })
};