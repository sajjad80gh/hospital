const patientModels=require("../models/patient")
const commentsModes=require("../models/comments")

exports.getPanel=(req,res,next)=>{
    patientModels.findById(req.session.iduser).then(([rows])=>{
        res.render("patient/patientPanel",{
            pageTitle:"patientPanel",
            patient:{
                id:rows[0].idpatient,
                name:rows[0].username,
                age:rows[0].age,
                imgSrc:"",
                isman:rows[0].isman
            }
        })
    })
    
}

exports.postPanel=(req,res,next)=>{
    patientModels.findOneByUsername(req.body.name)
    .then(([rows])=>{
        if(rows[0]===undefined || rows[0].iddoctor == req.body.idDoctor){
            patientModels.updateById(
                req.body.idPatient,
                req.body.name,
                req.body.age,
                req.body.isman)
                .then(()=>{
                    res.redirect("/patient/panel?okchnage")
                })
        }
        else{
            res.redirect("/patient/panel?notchnage")
        }
    })
}



exports.getRequest=(req,res,next)=>{
    commentsModes.findByIdPatient(req.session.iduser)
    .then(([rows])=>{
        const data =rows.reduce((arr,val)=>{
            return arr.concat({
                id:val.idrequest,
                name:val.usernamePatient,
                date:val.date,
                description:val.text,
                imgSrc:"",
                response:{
                    body:val.reply,
                    name:val.doctorUsername,
                    imgSrc:"",
                    date:val.responseDate
                }
            })
        },[])
        res.render("patient/patientRequest",{
            pageTitle:"patientPanel",
            idPatient:req.session.iduser,
            patient:data
        })
    })

    

}


exports.postRequest=(req,res,next)=>{
    console.log(req.body.idPatient)
    const comments=new commentsModes(req.body.idPatient,req.body.message)
    comments.save()
    .then(result=>{
        console.log(result)
        res.redirect("/patient/request")
    })
}