const mainRouter = require('./main.router.js')
const adminRouter = require('./admin.router')
const ruttienRouter = require('./main.router.js')

function routes(app){

    app.use('/ruttien', ruttienRouter)
    app.use('/admin', adminRouter)
    app.use('/', mainRouter)

}

module.exports = routes