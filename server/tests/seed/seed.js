const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('../../models/todo')
const {User} = require('../../models/user')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const users = [{
    _id: userOneId,
    email: 'nick@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'misty@example.com',
    password: 'userTwoPass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'abc123').toString()
        }]
}]

const populateUsers = (done) => {
    User.remove({}).then(() => {
        const userOne = new User(users[0]).save()
        const userTwo = new User(users[1]).save()


       return Promise.all([userOne,userTwo]).then(() => done())
    })
}

// seed data
const todos = [{
    _id: new ObjectID(),
    text: 'first test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}]

// remove all todos then add the new object
const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
}

module.exports = {todos, populateTodos, users, populateUsers }