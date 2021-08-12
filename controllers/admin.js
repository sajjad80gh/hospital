const bycrypt=require("bcryptjs")
const admin=require("../models/admin")
const patient=require("../models/patient")
const doctor =require("../models/doctor")
const path =require("path")
exports.getAdmin=(req,res,next)=>{
    res.render("admin/sign",{
        pageTitle:"ورود به پنل ادمین",
        error:req.flash("error")
    })
}
exports.getPanel=(req,res,next)=>{
    res.render("admin/panel",{
        pageTitle:"panel admin",

    })
}
exports.getPatient=(req,res,next)=>{
    const page=req.query.page?Number(req.query.page):1
    if(!(typeof page == "number" && page > 0)){
        return res.redirect("/admin/patient")
    }
    patient.findAll((Number(page)-1)*5,5)
    .then(([rows])=>{
        res.render("admin/patient",{
            pageTitle:"panel admin patient",
            users:rows,
            page:Number(page)
        })
    })
}

exports.getDoctor=(req,res,next)=>{
    const page=req.query.page?Number(req.query.page):1
    if(!(typeof page == "number" && page > 0)){
        return res.redirect("/admin/doctor")
    }
    doctor.findAll((Number(page)-1)*5,5)
    .then(([rows])=>{
        console.log(rows)
        res.render("admin/doctor",{
            pageTitle:"panel admin doctor",
            users:rows,
            page:Number(page)
        })
    })
}

exports.getDownload=(req,res,next)=>{
    res.download(path.join(__dirname ,"../public",req.query.src))
}

exports.postLoginAdmin=(req,res,next)=>{
    admin.findByUsername(req.body.username)
    .then(([rows])=>{
        bycrypt.compare(req.body.password,rows[0].password)
        .then(ok=>{
            if(ok){
                req.session.userid=rows[0].is_admin
                req.session.isLogin=true
                req.session.type="admin"
                req.session.username=rows[0].username

                res.redirect("/admin/panel")
            }else{
                req.flash("error","username or password not current")
                res.redirect("/admin/")
            }
        })
    })
}
exports.postSignAdmin=(req,res,next)=>{
    bycrypt.hash(req.body.password,12)
    .then(hash=>{
        const admino=new admin(req.body.username,hash)
        admino.save().then(result=>{
            console.log(result)
            res.redirect("/admin/panel")
        })
    })
    
}

exports.postRemovePatient=(req,res,next)=>{
    patient.removeById(req.body.id)
    .then(()=>{
        res.redirect("/admin/patient")
    })
}

exports.postRemoveDoctor=(req,res,next)=>{
    doctor.removeById(req.body.id)
    .then(response=>{
        console.log(response)
        res.redirect("/admin/doctor")
    })
}

