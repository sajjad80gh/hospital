const bcrypt=require("bcryptjs")
const {validationResult}=require("express-validator")
const patientModels=require("../models/patient")
const doctorModels=require("../models/doctor")

exports.getAuth=(req,res,next)=>{
    let message=req.flash("error")

    res.render("auth/auth",{
        pageTitle:"ورود و ثبت نام",
        error:message
    })
}


exports.postSignup=(req,res,next)=>{
    if(req.body.doctor==="false"){
        patientModels.findOneByUsername(req.body.name)
        .then(([rows])=>{
            if(rows[0]===undefined){
                bcrypt.hash(req.body.password,12).then(hashPAss=>{
                    const patient=new patientModels(req.body.name,hashPAss,req.body.age,req.body.isman)
                    patient.save().then(result=>{
                        req.session.isLogin=true;
                        req.session.username=req.body.name;
                        req.session.iduser=result[0].insertId;
                        req.session.type="patient";
        
                        res.redirect("/patient/panel")
                    })
                    .catch((err)=>console.log(err))
                }).catch(err=>console.log(err))
            }else{
                req.flash("error","username is used")
                res.redirect("/auth?username=Isused")
            }
        }).catch(err=>console.log(err))
        
    }else if(req.body.doctor==="true"){ 
        doctorModels.findByUsername(req.body.name)
        .then(([rows])=>{
            if(rows[0]===undefined){
                bcrypt.hash(req.body.password,12).then(hashpass=>{
                    const doctor=new doctorModels(req.body.name,hashpass,"",req.body.age,req.body.isman)
                    doctor.save()
                    .then(result=>{
                        req.session.isLogin=true;
                        req.session.username=req.body.name;
                        req.session.iduser=result[0].insertId;
                        req.session.type="doctor";
        
                        res.redirect("/doctor/panel")
                    })
                })
            }else{
                req.flash("error","username is used")
                res.redirect("/auth?username=Isused")
            }
        })
        .catch(err=>console.log(err))
    }
}
exports.postSignin=(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err=errors.array().map(val=>{
            return val.msg
        })
        req.flash("error",err.join(" | "))
        return res.redirect("/auth/")
    }

    if(req.body.doctor==="false"){
        patientModels.findOneByUsername(req.body.name).then(([rows,fields])=>{
            if(rows[0]!==undefined){
                bcrypt.compare(req.body.password,rows[0].password).then(isOk=>{
                    if(isOk){
                        req.session.isLogin=true;
                        req.session.username=rows[0].username;
                        req.session.iduser=rows[0].idpatient;
                        req.session.type="patient";

                        res.redirect("/patient/panel")
                    }else{
                        req.flash("error","username or password not curent")
                        res.redirect("/auth")
                    }
                })
                .catch(err=>console.log(err))
                
            }else{
                req.flash("error","first sign in")
                res.redirect("/auth")
            }
        }).catch(err=>{
            console.log(err.errno)
        })
    }else if(req.body.doctor==="true") {
        doctorModels.findByUsername(req.body.name)
        .then(([rows])=>{
            if(rows[0]!==undefined){
                bcrypt.compare(req.body.password,rows[0].password)
                .then(isOk=>{
                    if(isOk){
                        console.log(rows)
                        req.session.isLogin=true;
                        req.session.username=rows[0].username;
                        req.session.iduser=rows[0].iddoctor;
                        req.session.type="doctor";

                        res.redirect("/doctor/panel")
                    }else{
                        req.flash("error","username or password not curent")
                        res.redirect("/auth")
                    }
                })
            }else{
                req.flash("error","first sign in")
                res.redirect("/auth")
            }
        })
        .catch(err=>console.log(err))
    }
}
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
          res.status(400).send('Unable to log out')
        } else {
          res.redirect("/")
        }
      });
  };