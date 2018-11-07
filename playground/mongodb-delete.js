// const MongoClient = require ('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')
   
    //deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=> {
    //     console.log(result)
    // })
    
    //deleteOne
    // db.collection('Todos').deleteOne({text:'Eat lunch'}).then(result => {
    //     console.log(result)
    // })
    
    //findOneandDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then(result => {
    //     console.log(result)
    // })

    // db.collection('Users').deleteMany({name: 'Nick'}).then(result => {
    //     console.log(result)
    // })

    db.collection('Users').findOneAndDelete({ _id : new ObjectID('5bdf10a6f7d0632fabd1dfb0')}).then(result => {
        console.log(result)
    })
    

    //client.close()
})