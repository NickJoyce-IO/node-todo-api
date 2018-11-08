const express = require('express')
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

const app = express()

app.use(bodyParser.json())

// POST todo route - takes text and creates a new record in the database
app.post('/todos', (req, res) => {
    const todo = new Todo ({
        text: req.body.text
    })

    // save the todo to mongodb then return the document 
    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        //sending back an object instead of array
        res.send({todos})
    }, (e)=>{
        res.status(400).send(e)
    })
})

// message to let you know the server has started
app.listen(3000, () => {
    console.log('Started on port 3000')
})

module.exports = {app}