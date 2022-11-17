const db = require('../db/connection')
const{checkArticleExists} = require('../utils/db.js')

exports.selectTopics = ()=>{
    return db.query("SELECT * FROM topics;").then((result)=>result.rows);
}

exports.selectArticleById = (article_id) =>{
    return checkArticleExists(article_id).then(()=>{
    return db
    .query(`SELECT articles.*, COUNT(comments.article_id)::int AS comment_count 
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ;`, [article_id])
    .then((result)=>{
        
        return result.rows[0]
    })
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

exports.updateArticles = (article_id, inc_votes)=>{
    return checkArticleExists(article_id).then(()=>{
    if(!inc_votes || typeof inc_votes !== "number"){
    return Promise.reject({status:400,msg:'Bad Request'})}
    return db.query('UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;', [article_id, inc_votes])
    .then((result)=>{
        const article = result.rows[0]
        return article
    })
})}
exports.selectUsers = ()=>{
    return db.query("SELECT * FROM users;")
    .then((result)=>result.rows);
}

exports.selectArticles = (sort_by = 'created_at', order='DESC', chosen_topic) =>{ 
    const validOrder = ['DESC', 'ASC']  
    const validSort = ['author', 'title', 'article_id', 'topic', 'created_at','votes', 'comment_count']
    if(!validSort.includes(sort_by)){
        return Promise.reject({status:400, msg:'Invalid Sort'})
    }
    if(!validOrder.includes(order)){
        return Promise.reject({status:400, msg:'Invalid Order'})
    }
    let queryStr = `SELECT articles.author, articles.title, articles.topic, articles.article_id, articles.created_at, articles.votes, COUNT(comments.article_id)::int AS comment_count 
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id`;
    const queryValues = [];
    if (chosen_topic) {
        queryStr +=` WHERE articles.topic = $1`;
        queryValues.push(chosen_topic)
    }

    queryStr +=` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
   
    return db.query(queryStr, queryValues).then((result)=> result.rows)
}