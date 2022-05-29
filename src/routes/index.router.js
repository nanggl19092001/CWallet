const mainRouter = require('./ruttien.router.js')
const adminRouter = require('./admin.router')
const naptienRouter = require('./naptien.router.js')
const ruttienRouter = require('./ruttien.router.js')

function routes(app) {

    app.use('/naptien', naptienRouter)
    app.use('/ruttien', ruttienRouter)
    app.use('/admin', adminRouter)
    app.use('/', mainRouter)

}

module.exports = routes