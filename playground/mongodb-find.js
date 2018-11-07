// const MongoClient = require ('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')
    
    // db.collection('Todos').find({
    //     _id: new ObjectID('5bdf0efa652f382fa287bdae')
    // }).toArray().then((docs)=> {
    //     console.log('Todos')
    //     console.log(JSON.stringify(docs, undefined, 2))
    // },(err) => {
    //     console.log('unable to fetch', err)
    // })
    
    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}` )
        
    // }, (err) => {
    //     console.log('unable to fetch', err)
    // })

const search = {name: 'Megan'}

    db.collection('Users').find(search).toArray().then((docs) => {
        console.log('Found users')
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err)=> {
        console.log(err)
    })


    //client.close()
})