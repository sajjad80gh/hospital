function checkLogin(req){
    if(req.session.isLogin){
        return true
    }else{
        return false
    }
}
exports.isDoctor=(req,res,next)=>{
    if(checkLogin(req)){
        if(req.session.type!=="doctor"){
            req.flash("error","first you most login ")
            return res.redirect("/auth?firstLogin")
        }
        next()
    }else{
        req.flash("error","first you most login ")
        return res.redirect("/auth?firstLogin")
    }
}
exports.isPatient=(req,res,next)=>{
    if(checkLogin(req)){
        if(req.session.type!=="patient"){
            req.flash("error","first you most login ")
            return res.redirect("/auth?firstLogin")
        }
        next()
    }else{
        req.flash("error","first you most login ")
        return res.redirect("/auth?firstLogin")
    }
}
exports.isAdmin=(req,res,next)=>{
    if(checkLogin(req)){
        if(req.session.type!=="admin"){
            req.flash("error","first you most login ")
            return res.redirect("/admin?firstLogin")
        }
        next()
    }else{
        req.flash("error","first you most login ")
        return res.redirect("/auth?firstLogin")
    }
}