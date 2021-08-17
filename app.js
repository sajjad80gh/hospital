const express=require("express")
const path=require("path")
const multer =require("multer")
const mongoose=require("mongoose")

const patientRoute=require("./routes/patient")
const doctorRoute=require("./routes/doctor")
const authRoute=require("./routes/auth")
const adminRoute=require("./routes/admin")
const authCheck=require("./midlewere/auth")

const app=express()

app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"/public/","/image/"))
    }
    ,filename:(req,file,cb)=>{
        cb(null,file.filename+new Date().toISOString().replace(/:/g, '-')+"-"+file.originalname.split(' ').join('-'))
    }
})
app.use(multer({storage:storage}).single("image"))

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Orgin","*")
    res.setHeader("Access-Control-Allow-Methods","GET,POST,DELETE,PUT,PATCH")
    res.setHeader("Access-Control-Allow-Headers","*")
})

app.use("/patient",authCheck.isPatient,patientRoute)
app.use("/doctor",authCheck.isDoctor,doctorRoute)
app.use(authRoute)
app.use("/admin",adminRoute)

app.use((req,res,next)=>{
    res.status(404).render("error404",{pageTitle:"error 404 hospital"})
})
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });
  
mongoose.connect("mongodb://localhost:27017/hospital?readPreference=primary&appname=MongoDB%20Compass&ssl=false",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(()=>{
    app.listen(5000)
})
.catch((err)=>console.log(err))