const db = require('../db/connection')

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
        //console.log(result.rows[0])
        //const article = result.rows[0];
        if(result.rows.length === 0){
            return Promise.reject({status:404, msg:'Article does not exist'
            })
        }
        return result.rows[0]
    })
};