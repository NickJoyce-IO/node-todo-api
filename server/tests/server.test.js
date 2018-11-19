const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')
// insert the seed data

beforeEach(populateUsers)
beforeEach(populateTodos)


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

describe('PATCH /todos/:id', () => {
    it('should update the todo', done => {
        const hexId = todos[0]._id.toHexString()
        const update = { text: 'changed text', completed: true }
        request(app)
            .patch(`/todos/${hexId}`)
            .send(update)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true)
                expect(res.body.todo.text).toBe('changed text')
                expect(typeof res.body.todo.completedAt).toBe('number')
            }).end(done)
            
        })
           

    it('should clear completedAt when todo is not completed', (done) => {
        const hexId = todos[1]._id.toHexString()
        const update = { text: 'changed text!!', completed: false }
        request(app)
            .patch(`/todos/${hexId}`)
            .send(update)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.text).toBe('changed text!!')
                expect(res.body.todo.completedAt).toBeFalsy()
            }).end(done)
    })
})


// test to ensure that the /get me is doing stuff
describe('GET /users/me' , () => {
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.body.email).toBe(users[0].email)
        })
        .end(done)
    })

    it('should return 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({})
        })
        .end(done)
    })
})

describe('POST /users', () => {
    it('should create a user', (done) => {
        const email = 'example@example.com'
        const password = '123mnb!'

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy()
            expect(res.body._id).toBeTruthy()
            expect(res.body.email).toBe(email)
        })
        .end((err) => {
            if (err) {
                return done(err)
            }

            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy()
                expect(user.password).not.toBe(password)
                done()
            }).catch((e) => done(e))
        })
    })


    it('should return validation errors if request is invalid', (done) => {
        request(app)
        .post('/users')
        .send({
            email: 'n.com',
            password: '1'
        })
        .expect(400)
        .end(done)


    })

    it('should not create email if email in use', (done) => {
        request(app)
        .post('/users')
        .send({
            email: 'nick@example.com',
            password: 'abc123'
        })
        .expect(400)
        .end(done)
     })
})

describe('POST /users/login', () => {
    it('should log in user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
           email: users[1].email,
           password: users[1].password
        })
        .expect(200)
        .expect((res)=> {
            expect(res.headers['x-auth']).toBeTruthy()
        })
        .end((err, res) => {
            if (err) {
                return done(err)
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toMatchObject({
                    access: 'auth',
                    token: res.headers['x-auth']
                })
                done()
            }).catch((e) => done(e))
        })
    })

    it('should reject invalid login', () => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'garbage123!'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy()
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toNotMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    })
                    done()
                }).catch((e) => done(e))
    })
})
})