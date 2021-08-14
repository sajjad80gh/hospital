const bcrypt=require("bcryptjs")
const {validationResult}=require("express-validator")
const usersdb=require("../models/users")

exports.getAuth=(req,res,next)=>{
    let message=req.flash("error")

    res.render("auth/auth",{
        pageTitle:"ورود و ثبت نام",
        error:message
    })
}


exports.postSignup=(req,res,next)=>{
    const patient=req.body.doctor==="false"?true:false
    bcrypt.hash(req.body.password,12)
    .then(hashPAss=>{
        
        let userdata={
            username:req.body.name,
            password:hashPAss,
            age:req.body.age,
            isman:req.body.isman,
            patient:patient
        }
        if(req.body.doctor==="true"){
            userdata={
                username:req.body.name,
                password:hashPAss,
                madrak:req.body.age,
                isman:req.body.isman,
                patient:patient
            } 
        }
        const newuser=new usersdb(userdata)
        newuser.save().then(result=>{
            req.session.isLogin=true;
            req.session.username=req.body.name;
            req.session.iduser=result._id;
            req.session.type=result.patient?"patient":"doctor";
            const redirect =result.patient?"/patient/panel":"/doctor/panel"
            res.redirect(redirect)
        }).catch((err)=>{
            if(err.code==11000){
                req.flash("error","this username already is used")
                res.redirect("/auth")
            }
            console.log(err)
        })
    }).catch(err=>console.log(err))

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

    usersdb.findOne({username:req.body.name})
    .then((document)=>{
        if(document !==null){
            bcrypt.compare(req.body.password,document.password)
            .then(isOk=>{
                if(isOk){
                    req.session.isLogin=true;
                    req.session.username=document.username;
                    req.session.iduser=document._id;
                    req.session.type=document.patient?"patient":"doctor";
                    const redirect=document.patient?"/patient/panel":"doctor/panel";
                    res.redirect(redirect)
                }else{
                    req.flash("error","username or password not curent")
                    res.redirect("/auth")
                }
            })
        }else{
            req.flash("error","username or password not current")
            res.redirect("/auth")
        }
    })
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