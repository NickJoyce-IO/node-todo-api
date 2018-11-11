const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

// seed data
const todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo'
}]

// insert the seed data
beforeEach((done) => {
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos)
    }).then(() => done())
})


// Test the POST /todos route
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Testy mctest face'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) =>{
                if (err) {
                    return done(err)
                }

                // check that something was add to the database
                Todo.find({text}).then((todos)=> {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((e)=> done(e))
            })
    })

    it('should not create todo with invalid body', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }


                // ensure that no records were add to the database
                Todo.find().then((todos)=> {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => done(e))
            })
    })
})

// test the GET todos route
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect(res => {
            expect(res.body.todos.length).toBe(2)

        })
        .end(done)
    })
})

// test the GET /todos:id route

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
    })

    it('should return 404 if todo not found', (done) => {
        const testId = new ObjectID().toHexString
        request(app)
        .get(`/todos/${testId}`)
        .expect(404)
        .end(done)
    })

    it('should return a 404 for non-object ids', (done) => {
        request(app)
        .get('/todos/123abc')
        .expect(404)
        .end(done)
    })
})

// Test the DELETE /todos/:id route by testing the deletion of one of the seed records

describe('DELETE /todos:/:id', () => {
    it('should remove a todo', (done) => {
        const hexId = todos[1]._id.toHexString()
        // when delete expect the delete to be a success and the return object to be the one request for delete
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                }

                // check that the record has been removed
                Todo.findById(hexId).then(data => {
                    expect(data).toBeFalsy()
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should return a 404 if todo not found', (done) => {
        const testId = new ObjectID().toHexString
        request(app)
            .delete(`/todos/${testId}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 if objectid is invalid', (done) => {
        request(app)
            .delete('/todos/123abc')
            .expect(404)
            .end(done)
    })
})