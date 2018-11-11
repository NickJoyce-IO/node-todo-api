const { ObjectID } = require('mongodb')

const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

// Deprecated
// Todo.remove({}).then ((result) => {
//     console.log(result)
// })

// Todo.findOneAndRemove({})
// Todo.findbyIdAndRemove

// Todo.findByIdAndRemove('5be5d67be8d6812f18a5ebd5').then(todo => {
//     console.log(todo)
// })