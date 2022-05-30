const mainRouter = require('./main.router.js')
const adminRouter = require('./admin.router')
const ruttienRouter = require('./main.router.js')
const muatheRouter = require('./muathe.router.js')
const lichsuRouter = require('./lichsu.router.js')
const loginRouter = require('./login.router')

function routes(app){

    app.use('/login', loginRouter)

    app.use('/ruttien', ruttienRouter)
    
    app.use('/admin', adminRouter)

    app.use('/muathe', muatheRouter)

    app.use('/lichsu', lichsuRouter)

    app.use('/', mainRouter)

}

module.exports = routes