require('dotenv').config()
var express = require('express')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var path = require('path')
var app = express()

var bodyParser = require('body-parser')

var {
	engine
} = require('express-handlebars')

// app.use(session({
//   cookie: {
//     maxAge: 60000
//   },
// }));

app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'somesecret',
	cookie: {
		maxAge: 60000
	}
}));


var routes = require('./routes/index.router.js')

const port = 3000 || process.env.PORT

app.engine('handlebars', engine())

app.set('view engine', 'handlebars')

app.set('views', path.join(__dirname, '/views'))

app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(cookieParser('luannt'));

app.use(express.static(__dirname + '/public'))

app.use(flash());
app.use(express.json())

app.use((req, res, next) => {
	res.locals.flash = req.session.flash
	delete req.session.flash
	next()
})

routes(app)

app.listen(port, () => {
	console.log(`server up at port ${port}`)
})