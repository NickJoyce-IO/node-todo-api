const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

// seed data
const todos = [{
    text: 'first test todo'
}, {
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