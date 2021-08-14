const usersdb=require("../models/users")
const commentsModes=require("../models/comments")
const fs=require("fs")
const path =require("path")

exports.getPanel=(req,res,next)=>{
    usersdb.findById(req.session.iduser)
    .then((documents)=>{
        res.render("doctor/doctorPanel",{
            pageTitle:"doctorPanel",
            doctor:{
                id:documents._id,
                name:documents.username,
                proficiency:documents.age,
                imgSrc:documents.image,
                evidence:documents.isman
            }
        })
    })
}


exports.postPanel=(req,res,next)=>{
    usersdb.findById(req.body.idDoctor)
    .then(async(document)=>{

        if(req.file!==undefined && document.image !== undefined){
            await fs.unlink(path.join(__dirname,"../public",document.image),(err)=>{
                console.log(err)
            })
        }
        const imageSrc=req.file!==undefined ?"/image/"+req.file.filename:document.image

        if(document !== null || document.username == req.body.name){
            document.username=req.body.name
            document.age=req.body.proficiency
            document.isman=req.body.evidence
            document.image=imageSrc
            document.save()
            .then(response=>{
                res.redirect("/doctor/panel?ok")
            })
            .catch(err=>{
                if(err.code==11000){
                    res.redirect("/doctor/panel?err=username_uased")
                }
                console.log(err)
            })
        }
        else{
            res.redirect("/doctor/panel?notchange")
        }
    })
}



exports.getPatient = (req,res,next)=>{
    commentsModes.find()
    .populate("id","username")
    .populate("reply.id",["username","image"])
    .exec()
    .then((rows)=>{
        const data =rows.reduce((arr,val)=>{
            console.log(val.reply)
            const reply=val.reply.map(val=>{
                return {
                    text:val.text,
                    imgSrc:val.id!==undefined ?val.id.image:"",
                    username:val.id!==undefined ?val.id.username:"",
                    created:val.created
                }
            })
            return arr.concat({
                id:val._id,
                name:val.id.username,
                date:val.created,
                description:val.text,
                imgSrc:val.image,
                response:reply
            })
        },[])
        return data
    }).then(rsult=>{
        res.render("patient/patientGet",{
            pageTitle:"doctorPanel",
            patient:rsult
        })
    })
    
}
exports.postPatient=(req,res,next)=>{
    const id=req.body.idrequest,
    iddoctor=req.session.iduser,
    comment=req.body.comment
    commentsModes.findById(id)
    .then((result)=>{          
        const items=[...result.reply]
        items.push({
            id:iddoctor,
            text:comment
        })
        result.reply=items
        result.save()
        .then(()=>{
            res.redirect("/doctor/patient")
        })
    })
}