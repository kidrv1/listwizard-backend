// npm i express, cors, mongoose, dotenv, jsonwebtoken, mongoose-paginate-v2, bcrypt

const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const routes = require('./routes/ToDoRoute')
const userRoutes = require('./routes/auth');

require('dotenv').config()

const app = express()
const PORT = process.env.port || 5000

app.use(express.json())
app.use(cors())

mongoose
.connect(process.env.MONGODB_URL)
.then(() => console.log(`Connected to MongoDB :)`))
.catch((err) => console.log(err))

app.use(routes)
app.use('/api/auth', userRoutes)

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
