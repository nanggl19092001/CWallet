require('dotenv').config()
const express = require('express')

const cookieParser = require('cookie-parser')

const session = require('express-session')

const flash = require('express-flash')

const path = require('path')

const app = express()

app.use(cookieParser())

const bodyParser = require('body-parser')

const {
    engine
} = require('express-handlebars')

const routes = require('./routes/index.router.js')

const methodOverride = require('method-override');

app.use(methodOverride('_method'));

const port = 3000 || process.env.PORT

app.engine('.handlebars', engine({
  helpers: {
    and: (a,b) => a===b,
    not: (a,b) => a !== b
  }}))

app.set('view engine', 'handlebars')

app.set('views', path.join(__dirname,'/views'))

app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.json())

app.use(express.static(__dirname + '/uploads'))

app.set('views', path.join(__dirname, '/views'))

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(express.json())

app.use(express.static(path.join(__dirname, '/public')));

app.use(flash())
routes(app)

app.listen(port, () => {
    console.log(`server up at port ${port}`)
})