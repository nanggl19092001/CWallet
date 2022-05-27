const ruttienRouter = require('./main.router.js')

function routes(app) {
    app.use('/ruttien', ruttienRouter)
}

module.exports = routes