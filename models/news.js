const db = require('../db/connection')
const orderBy = require('lodash');
const articles = require('../db/data/test-data/articles');

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