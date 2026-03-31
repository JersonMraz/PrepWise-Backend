const express = require('express')
const cors = require('cors')

require('dotenv').config()

const prisma = require('./lib/prisma')

const app = express()

app.use(cors())
app.use(express.json())

const usersRoute = require('./routes/usersroute')
// const recipeRoute = require('./routes/recipeRoute')
// const mealplanRoute = require('./routes/mealplanRoute')
// const favoriteRoute = require('./routes/favoriteRoute')

app.use('/api/users', usersRoute)
// app.use('/recipes', recipeRoute)
// app.use('/mealplans', mealplanRoute)
// app.use('/favorites', favoriteRoute)

const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})