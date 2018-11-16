const bcrypt = require('bcryptjs')

const password = 'abc123!'

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash)
//     })
// })

const hashedPassword = '$2a$10$3Pr2peWtJ22.KIj3oFKpfesdK2XzrS.SGQvnbtJJPjEDE0ni6pt86'

bcrypt.compare(password + '123', hashedPassword, (err, res) => {
    console.log(res)
})


// const {SHA256} = require('crypto-js')
// const jwt = require('jsonwebtoken')

// const data = {
//     id: 10
// }

// const token = jwt.sign(data, 'abc123')
// console.log(token)

// const decoded = jwt.verify(token, 'abc123')
// console.log(decoded)


// const message = 'I am user number 3'

// const hash = SHA256(message).toString()

// console.log(`message: ${message}`)
// console.log(`hash: ${hash}`)

// const data = {
//     id: 4
// }
// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString()

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()

// if (resultHash === token.hash) {
//     console.log ('Data was not changed')
// } else {
//     console.log('Data was changed, do not trust!')
// }
