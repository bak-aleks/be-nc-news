const request = require('supertest')
const seed = require('../db/seeds/seed')
const app = require('../app')
const db = require('../db/connection')
const testData = require('../db/data/test-data')
const { response } = require('../app')


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
                console.log(article)
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
})

test('404 status', ()=>{
    return request(app)
    .get('/api/notaAValidRoute')
    .expect(404)
    .then(({body})=>{
        expect(body.msg).toBe('Route does not exist')
    })
})