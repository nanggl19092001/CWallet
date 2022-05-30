const mainRouter = require('./main.router.js')
const profileKHRouter = require('./profileKH.router.js')
const authRouter = require('./auth.router.js')


function routes(app){

    app.use('/', mainRouter)
    app.use('/profileKH',profileKHRouter)
    app.use('/auth',authRouter)
}

module.exports = routes