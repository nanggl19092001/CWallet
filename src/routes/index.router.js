const mainRouter = require('./main.router.js')
const adminRouter = require('./admin.router')
const muatheRouter = require('./muathe.router.js')
const lichsuRouter = require('./lichsu.router.js')
const loginRouter = require('./login.router')
const naptienRouter = require('./naptien.router.js')
const ruttienRouter = require('./ruttien.router.js')
const registerRouter = require('./register.router.js')

function routes(app) {

    app.use('/login', loginRouter)

    app.use('/register', registerRouter)

    app.use((req,res,next) => {
        if(!req.session.user){
            res.redirect('/login')
        }
        else{
            next()
        }
    })

    app.use('/logout',(req,res) => {
        req.session.destroy()
        res.redirect('/')
    })

    app.use('/naptien', naptienRouter)

    app.use('/ruttien', ruttienRouter)
    
    app.use('/admin', adminRouter)

    app.use('/muathe', muatheRouter)

    app.use('/lichsu', lichsuRouter)

    app.use('/', mainRouter)

}

module.exports = routes