const { ObjectID } = require('mongodb')

const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

// const id = '5be48486fd74353d69b988c611'

// // Validator from mongoDB to validate whether ID is formed correctly
// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid')
// }


// Search by ID without creating a new ObjectID - Mongoose feature
// Todo.find({
//     _id: id
// }).then ((todos) => {
//     console.log('Todos', todos)
// })

// // Find the first one
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo)
// })

// You can just pass in the ID as a string with findById
// Todo.findById(id).then((todo) => {
//     if (!todo){
//         return console.log('Id not found')
//     }
//     console.log('Todo by ID', todo)
// }).catch((e)=> {
//     console.log(e)
// })


// find a user based on ID
const userId = '5be3f608e6ab8838218160c4'

User.findById(userId).then(user => {
    if(!user){
        return console.log('User not found')
    }
    console.log(`User: ${user}`)
}).catch((e)=> {
    console.log(e.message)
})