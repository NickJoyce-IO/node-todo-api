const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
const _ = require('lodash')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

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

// GET /todos route - returns all todos
app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        //sending back an object instead of array
        res.send({todos})
    }, (e)=>{
        res.status(400).send(e)
    })
})

// GET /todos/1234 - getting a todo by its ID
app.get('/todos/:id', (req, res)=> {
    const id = req.params.id
    // Validator from mongoDB to validate whether ID is formed correctly
    if (!ObjectID.isValid(id)) {
       return res.status(404).send()
    }
    
    // Find the doc by id and return if found, else 404 - not found
    Todo.findById(id).then(todo => {
        if(todo) {
            // sending it back as an object
            res.send({todo})
        } else if (!todo) {
            res.status(404).send('Not found')
        }
    })
    // Error is the second argument
}, e => {
    res.send(400)
})

// DELETE /todos/:id - to remove a todo by its ID
app.delete('/todos/:id', (req, res) => {
    // Validate the Id
    const id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    // Find the doc by ID and remove, if no doc return 404
    Todo.findByIdAndRemove(id).then(todo => {
        if(todo) {
            res.status(200).send({todo})
        } else if (!todo){
            res.status(404).send('Not found')
        }
    }, e=> {
        res.status(400).send()
    })
})

//PATCH route for /todos/:id
app.patch('/todos/:id', (req, res) => {
    const id = req.params.id
    // define only the fields that we want users to update
    const body = _.pick(req.body, ['text', 'completed'])
    console.log(body)
    // validate the id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    // if the completed field is a boolean and it is true, add the time
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false
        body.completedAt = null
    }
    console.log(body)

    // find the objcet
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
        if (!todo) {
            return res.status(404).send()
        }
        res.send({todo})
    }).catch(e => {
        res.status(400).send()
    })
})


// message to let you know the server has started
app.listen(port, () => {
    console.log(`Started on port ${port}`)
})

module.exports = {app}