const request = require('supertest')
const seed = require('../db/seeds/seed')
const app = require('../app')
const db = require('../db/connection')
const testData = require('../db/data/test-data')
//const { response } = require('../app')
const endpoints = require('../endpoints.json')

beforeEach(()=>seed(testData))

afterAll(()=>{
    if(db.end) db.end();
})

describe('1. GET/api/topics', ()=>{
    test('status 200, should respond with topics objects in array',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response)=>{
            expect(response.body.topics.length).toBeGreaterThan(0)
            expect(response.body.topics).toEqual(expect.any(Array));
            response.body.topics.forEach((topic)=>{
                expect(topic).toEqual(expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String)
                }))
            })
        })
    })
})
describe('2.GET/api/articles', ()=>{
    test('status 200, should respond with an array of article objects sorted by date', ()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles.length).toBeGreaterThan(0)
            expect(response.body.articles).toEqual(expect.any(Array))
            expect(response.body.articles).toBeSortedBy('created_at', {descending:true})
            response.body.articles.forEach((article)=>{
                expect(article).toEqual(expect.objectContaining({
                    author: expect.any(String),
                    title:expect.any(String),
                    article_id:expect.any(Number),
                    topic:expect.any(String),
                    created_at:expect.any(String),
                    votes:expect.any(Number),
                    comment_count: expect.any(Number)
                }))}
            )
        })
    })
    test('status 200, sorted by created_at in desc order DEFAULT',()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles).toBeSortedBy('created_at', {descending:true})
        })
    })
    test('status 200, sorted by created_at in asc order',()=>{
        return request(app)
        .get('/api/articles?order=ASC')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles).toBeSortedBy('created_at', {descending:false})
        })
    })
    test('status 200, sorted by created_at in desc order',()=>{
        return request(app)
        .get('/api/articles?order=DESC')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles).toBeSortedBy('created_at', {descending:true})
        })
    })
    test('status 200, sorted by author is desc order',()=>{
        return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles).toBeSortedBy('author', {descending:true})
        })
    })
    test('status 200, sorted by author is asc order',()=>{
        return request(app)
        .get('/api/articles?sort_by=author&order=ASC')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles).toBeSortedBy('author', {descending:false})
        })
    })
    test('status 200, sorted by topic is asc order',()=>{
        return request(app)
        .get('/api/articles?sort_by=topic&order=ASC')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles).toBeSortedBy('topic', {descending:false})
        })
    })
    test('status 200, filters by topic',()=>{
        return request(app)
        .get('/api/articles?chosen_topic=mitch')
        .expect(200)
        .then((response)=>{
        response.body.articles.forEach((article)=>{
            expect(article.topic).toBe('mitch')
        })
        expect(response.body.articles.length).toBe(11)
        })
    })
    test('status 400, invalid order',()=>{
        return request(app)
        .get('/api/articles?order=invalid')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Invalid Order')
        })
    })
    test('status 400, invalid sort',()=>{
        return request(app)
        .get('/api/articles?sort_by=invalid')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Invalid Sort')
        })
    })
    test('status 200, filters by topic, sorts by title and orders by asc',()=>{
        return request(app)
        .get('/api/articles?chosen_topic=mitch&sort_by=title&order=ASC')
        .expect(200)
        .then((response)=>{
        response.body.articles.forEach((article)=>{
            expect(article.topic).toBe('mitch')
        })
        expect(response.body.articles.length).toBe(11)
        expect(response.body.articles).toBeSortedBy('title', {descending:false})
        })
    })
})

describe('3.GET/api/articles/:article_id', ()=>{
    test('status 200, should respond with corresponding object', ()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response)=>{
            expect(response.body.article).toMatchObject({
                article_id:1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100
            })
        })
    })
    test('status 200, should respond with corresponding object with comment_count key', ()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response)=>{
            expect(response.body.article).toMatchObject({
                article_id:1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                comment_count:11
            })
        })
    })
    test('GET:404 sends an appropriate error message when given a valid but non-existend id',()=>{
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Article not found')
        })
    })
    test('GET:400 sends an appropriate error message when given an invialid id',()=>{
        return request(app)
        .get('/api/articles/invalid')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Invalid id')
        })
    })
})
describe('4.GET/api/articles/:article_id/comments', ()=>{
    test('status 200, should respond with an array of comments for given article id', ()=>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response)=>{
            expect(response.body.comments.length).toBeGreaterThan(0)
            expect(response.body.comments).toEqual(expect.any(Array))
            expect(response.body.comments).toBeSortedBy('created_at', {descending:true})
            response.body.comments.forEach((comment)=>{
                expect(comment).toEqual(expect.objectContaining({
                    author: expect.any(String),
                    article_id:expect.toBeNumber(1),
                    comment_id:expect.any(Number),
                    created_at:expect.any(String),
                    votes:expect.any(Number),
                    body:expect.any(String)
                }))}
            )
        })
    })
    test('status 200, article with no comments returns an empty array',()=>{
        return request(app)
        .get('/api/articles/8/comments')
        .expect(200)
        .then((response)=>{
            expect(response.body.comments).toEqual([])
    })
})
})
describe('5. POST /api/articles/:article_id/comments', ()=>{
    test('POST: 201 insert new comment',()=>{
        const newComment= {
            username:"icellusedkars",
            body: "testing comment"
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then((response)=>{
            expect(response.body.comment).toMatchObject({
                comment_id:expect.any(Number),
                article_id: 1,
                created_at:expect.any(String),
                votes:0,
                body:"testing comment",
                author:"icellusedkars"
            })
        })
    })
    test('status 400: no body in comment',()=>{
        const newComment1 ={username:"icellusedkars"}
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment1)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('status 400: no username in comment',()=>{
        const newComment1 ={body:"something"}
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment1)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('status 400: no content in comment',()=>{
        const newComment1 ={}
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment1)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('status 400: username is not a string',()=>{
        const newComment1 ={username:1,
        body: "testing comment"}
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment1)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad Request')
        })
    })
    
    test('GET:404 sends an appropriate error message when given a valid but non-existend id',()=>{
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Article not found')
        })
    })
})
describe('6.PATCH /api/articles/:article_id', ()=>{
    test('patch 200 responds with updated object', ()=>{
        const updatedArticle ={inc_votes: 100}
        return request(app)
        .patch('/api/articles/1')
        .send(updatedArticle)
        .expect(200)
        .then((response)=>{
            expect(response.body.article).toMatchObject({
                title: 'Living in the shadow of a great man',
                topic:'mitch',
                article_id: 1,
                created_at:expect.any(String),
                votes:200,
                body:'I find this existence challenging',
                author:'butter_bridge'
            })
        })
    })
    test('status 400: no update given',()=>{
        const newUpdate ={}
        return request(app)
        .patch('/api/articles/1')
        .send(newUpdate)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('status 400: type of votes in update is not a number',()=>{
        const newUpdate ={inc_votes:'hello'}
        return request(app)
        .patch('/api/articles/1')
        .send(newUpdate)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('status 400: invalid article id',()=>{
        const newUpdate ={inc_votes:100}
        return request(app)
        .patch('/api/articles/invalid')
        .send(newUpdate)
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Invalid id')
        })
    })
    test('status 404: valid but non-existant id',()=>{
        const newUpdate ={inc_votes:100}
        return request(app)
        .patch('/api/articles/94307')
        .send(newUpdate)
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Article not found')
        })
    })
})

describe('7. GET/api/users', ()=>{
    test('status 200, should respond with users objects in array',()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response)=>{
            expect(response.body.users.length).toBeGreaterThan(0)
            expect(response.body.users).toEqual(expect.any(Array));
            response.body.users.forEach((user)=>{
                expect(user).toEqual(expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                }))
            })
        })
    })
})
describe(" 8. DELETE api/comments/comment_id",()=>{
    test("status 204, responds with empty body",()=>{
        return request(app).delete("/api/comments/1").expect(204)
    })
    test("status 404, error message when given a non-existent id",()=>{
        return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('Comment not found')
        })
    })
    test('status 400: invalid comment id',()=>{
        return request(app)
        .delete('/api/comments/invalid')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Invalid id')
        })
    })
})

describe('9. GET/api', ()=>{
    test('status 200, should respond with endpoints',()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then((response)=>{
            expect(response.body.msg).toEqual(endpoints);
        })
    })
})

test('404 status', ()=>{
    return request(app)
    .get('/api/notaAValidRoute')
    .expect(404)
    .then(({body})=>{
        expect(body.msg).toBe('Route does not exist')
    })
})