const doctorModels=require("../models/doctor")
const commentsModes=require("../models/comments")
const fs=require("fs")
const path =require("path")
exports.getPanel=(req,res,next)=>{
    doctorModels.findById(req.session.iduser).then(([rows])=>{
        res.render("doctor/doctorPanel",{
            pageTitle:"doctorPanel",
            doctor:{
                id:rows[0].iddoctor,
                name:rows[0].username,
                proficiency:rows[0].madrak,
                imgSrc:rows[0].image,
                evidence:rows[0].takhasos
            }
        })
    })
    
}


exports.postPanel=(req,res,next)=>{
    doctorModels.findByUsername(req.body.name)
    .then(async([rows])=>{
        if(req.file!==undefined ){
            fs.unlink(path.join(__dirname,"../public",rows[0].image),(err)=>{
                console.log(err)
            })
        }
        const imageSrc=req.file!==undefined ?"/image/"+req.file.filename:rows[0].image
        if(rows[0]===undefined || rows[0].iddoctor == req.body.idDoctor){ 
            doctorModels.updateById(
                req.body.idDoctor,
                req.body.name,
                req.body.evidence,
                req.body.proficiency,
                imageSrc
                )
                .then(()=>{
                    res.redirect("/doctor/panel")
                })
        }
        else{
            res.redirect("/doctor/panel?notchange")
        }
    })
}



exports.getPatient = (req,res,next)=>{
    commentsModes.findAllComments()
    .then(async([rows])=>{
        var data=[]
        for(let val of rows){
            await commentsModes.findReply(val.idrequest)
            .then(([record])=>{
                data.push({
                    id:val.idrequest,
                    name:val.usernamePatient,
                    date:val.date,
                    description:val.text,
                    imgSrc:"",
                    response:record
                })
            })        
        }
        return data
    }).then(rsult=>{
        console.log(rsult)
        res.render("patient/patientGet",{
            pageTitle:"doctorPanel",
            patient:rsult
        })
    })
    
}
exports.postPatient=(req,res,next)=>{
    const id=req.body.idrequest,iddoctor=req.session.iduser,comment=req.body.comment
    commentsModes.insertReply(id,iddoctor,comment)
    .then(([result])=>{
        console.log(result)
        res.redirect("/doctor/patient")
    })
}