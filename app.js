const express=require("express")
const path=require("path")
const session=require("express-session")
const redis=require("redis")
const redisStore=require("connect-redis")(session)
var csurf = require('csurf')
const flash=require("connect-flash")
const multer =require("multer")

const patientRoute=require("./routes/patient")
const doctorRoute=require("./routes/doctor")
const authRoute=require("./routes/auth")
const adminRoute=require("./routes/admin")
const indexRoute=require("./routes/index")
const authCheck=require("./midlewere/auth")

const app=express()
const redisClient=redis.createClient()
const storeSession=new redisStore({client:redisClient,ttl:3600})
const csrfProtection=csurf()

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs")
app.set("views",path.join(__dirname,'views'))


app.use(session({
    secret:"hello",
    resave:false,
    saveUninitialized:false,
    store: storeSession
}))
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"/public/","/image/"))
    }
    ,filename:(req,file,cb)=>{
        cb(null,file.filename+new Date().toISOString().replace(/:/g, '-')+"-"+file.originalname.split(' ').join('-'))
    }
})
app.use(multer({storage:storage}).single("image"))
app.use(flash())
app.use(csrfProtection)
app.use((req,res,next)=>{
    res.locals.isLogin=req.session.isLogin
    res.locals.type=req.session.type
    res.locals.csrfToken=req.csrfToken()
    
    next()
})

app.use("/patient",authCheck.isPatient,patientRoute)
app.use("/doctor",authCheck.isDoctor,doctorRoute)
app.use(authRoute)
app.use("/admin",adminRoute)
app.use("/",indexRoute)

app.use((req,res,next)=>{
    res.status(404).render("error404",{pageTitle:"error 404 hospital"})
})


app.listen(5000)