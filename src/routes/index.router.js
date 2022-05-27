const mainRouter = require('./main.router.js')
const adminRouter = require('./admin.router')

function routes(app){

    app.use('/admin', adminRouter)
    app.use('/', mainRouter)
}

module.exports = routes