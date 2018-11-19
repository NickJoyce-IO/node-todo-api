require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
const _ = require('lodash')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')
const { authenticate } = require('./middleware/authenticate')

const app = express()
const port = process.env.PORT

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

    // find the object
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
        if (!todo) {
            return res.status(404).send()
        }
        res.send({todo})
    }).catch(e => {
        res.status(400).send()
    })
})

// POST /users
app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password'])
    const user = new User(body)
    
    user.save().then(()=> {
        // generate Auth Token to identify user and sign it to x-auth
        return user.generateAuthToken()
    }).then((token) => {
        // send back the header and the user
        res.header('x-auth', token).send(user)
    }).catch ((e) => {
        res.status(400).send(e)
    })
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password'])
    console.log(body)
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user)
        })
    }).catch((e) => {
        res.status(400).send()
    })

})

//DELETE token logout

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }), () => {
        res.status(400).send()
    }
})


// message to let you know the server has started
app.listen(port, () => {
    console.log(`Started on port ${port}`)
})

module.exports = {app}