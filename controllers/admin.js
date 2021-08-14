const bycrypt=require("bcryptjs")
const admin=require("../models/admin")
const patient=require("../models/users")
const usersdb=require("../models/users")
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
    usersdb.find({patient:true})
    .then(result=>{
        res.render("admin/patient",{
            pageTitle:"panel admin patient",
            users:result,
            page:Number(page)
        })
    })
}

exports.getDoctor=(req,res,next)=>{
    const page=req.query.page?Number(req.query.page):1
    if(!(typeof page == "number" && page > 0)){
        return res.redirect("/admin/doctor")
    }
    usersdb.find({patient:false})
    .then(result=>{
        res.render("admin/doctor",{
            pageTitle:"panel admin doctor",
            users:result,
            page:Number(page)
        })
    })
}

exports.getDownload=(req,res,next)=>{
    res.download(path.join(__dirname ,"../public",req.query.src))
}

exports.postLoginAdmin=(req,res,next)=>{
    usersdb.findOne({username:req.body.username})
    .then((document)=>{
        if(document === null){
            req.flash("error","username or password not current")
            res.redirect("/admin/")
            return next()
        }
        console.log(document)
        console.log(document.admin !== undefined ,document.admin)
        if(document.admin !== undefined && document.admin){
            bycrypt.compare(req.body.password,document.password)
            .then(ok=>{
                if(ok){
                    req.session.userid=document._id
                    req.session.isLogin=true
                    req.session.type="admin"
                    req.session.username=document.username
                    res.redirect("/admin/panel")
                }else{
                    req.flash("error","username or password not current")
                    res.redirect("/admin/")
                }
            })
        }else{
            req.flash("error","username or password not current")
            res.redirect("/admin/")
        }
    })
}

exports.postSignAdmin=(req,res,next)=>{
    bycrypt.hash(req.body.password,12)
    .then(hash=>{
        const admino=new usersdb({
            username:req.body.username,
            password:hash,
            admin:true
        })
        admino.save().then(result=>{
            res.redirect("/admin/panel?addNew")
        })
    })
    
}

exports.postRemove=(req,res,next)=>{
    usersdb.findOneAndDelete(req.body.id)
    .then((result)=>{
        console.log(result)
        res.redirect("/admin/panel")
    })
}