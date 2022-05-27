require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')

const path = require('path')
const app = express()

app.use(cookieParser())

const bodyParser = require('body-parser')

const {
    engine
} = require('express-handlebars')

const routes = require('./routes/index.router.js')

const port = 3000 || process.env.PORT

app.engine('handlebars', engine())

app.set('view engine', 'handlebars')

app.set('views', path.join(__dirname, '/views'))

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(express.json())
app.use('/public', express.static(path.join(__dirname, '/public')));

routes(app)

app.listen(port, () => {
    console.log(`server up at port ${port}`)
})