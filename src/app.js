require('dotenv').config()
const express = require('express')

const path = require('path')
const app = express()

const bodyParser = require('body-parser')

const {engine} = require('express-handlebars')

const routes = require('./routes/index.router.js')

const methodOverride = require('method-override');
app.use(methodOverride('_method'));


const port = 3000 || process.env.PORT

app.engine('handlebars', engine())

app.set('view engine', 'handlebars')

app.set('views', path.join(__dirname,'/views'))
app.engine('.handlebars', engine({
    helpers: {
      and: (a,b) => a===b,
      not: (a,b) => a !== b
    }}));

app.use(bodyParser.urlencoded({extended: false}))

app.use('/public', express.static(path.join(__dirname, '/public')));//tung

app.use(express.json())

routes(app)

app.listen(port, () => {
    console.log(`server up at port ${port}`)
})