const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()
const cors = require ('cors')
const { graphqlHTTP } = require ('express-graphql')
const schema = require ('./schema/schema')
const port = process.env.PORT || 8000
const app = express();

connectDB()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
})
)


app.listen(port ,()=>{
    console.log('listening at port 8000')
})