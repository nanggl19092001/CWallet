const mainRouter = require('./main.router.js')
const registerRouter = require('./register.router.js')
const loginRouter = require('./login.router.js')

function routes(app) {
    app.use('/login', loginRouter)
    app.use('/register', registerRouter)
    app.use('/', mainRouter)
}

module.exports = routes