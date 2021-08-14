const userdb=require("../models/users")
const commentsModes=require("../models/comments")

exports.getPanel=(req,res,next)=>{
    userdb.findById(req.session.iduser)
    .then((document)=>{
        res.render("patient/patientPanel",{
            pageTitle:"patientPanel",
            patient:{
                id:document._id,
                name:document.username,
                age:document.age,
                imgSrc:"",
                isman:document.isman
            }
        })
    })
    
}

exports.postPanel=(req,res,next)=>{
    userdb.findById(req.session.iduser)
    .then(document=>{
        if(document !== null || document.username == req.body.name){
                document.username=req.body.name
                document.age=req.body.age
                document.isman=req.body.isman
                document.save()
                .then(response=>{
                    res.redirect("/patient/panel?ok")
                })
                .catch(err=>{
                    if(err.code==11000){
                        res.redirect("/patient/panel?err=username_uased")
                    }
                    console.log(err)
                })
        }
        else{
            res.redirect("/patient/panel?notchnage")
        }
    })
}



exports.getRequest=(req,res,next)=>{
    commentsModes.find({id:req.session.iduser})
    .populate("id","username")
    .populate("reply.id",["username","image"])
    .exec()
    .then((data)=>{        
        res.render("patient/patientRequest",{
            pageTitle:"patientPanel",
            idPatient:req.session.iduser,
            patient:data
        })
    })
}


exports.postRequest=(req,res,next)=>{
    const comments=new commentsModes({
        id:req.body.idPatient,
        text:req.body.message,
        reply:[]
    })
    comments.save()
    .then(result=>{
        console.log(result)
        res.redirect("/patient/request")
    })
}