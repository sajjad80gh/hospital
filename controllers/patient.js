const userdb=require("../models/users")
const commentsModes=require("../models/comments")

exports.getPanel=(req,res,next)=>{
    userdb.findById(req.userId)
    .then((document)=>{
        res.status(200).json({
            id:document._id,
            name:document.username,
            age:document.age,
            imgSrc:"",
            isman:document.isman
        })
    })
}

exports.postPanel=(req,res,next)=>{
    userdb.findById(req.userId)
    .then(document=>{
        if(document !== null || document.username == req.body.name){
                document.username=req.body.name
                document.age=req.body.age
                document.isman=req.body.isman
                document.save()
                .then(response=>{
                    res.status(200).json({message:"send message"})
                })
                .catch(err=>{
                    if(err.code==11000){
                        res.status(403).json({message:"its used"})
                    }
                })
        }
        else{
            res.status(404).json({message:"not find "})
        }
    })
}



exports.getRequest=(req,res,next)=>{
    commentsModes.find({id:req.userId})
    .populate("id","username")
    .populate("reply.id",["username","image"])
    .exec()
    .then((data)=>{        
        res.status(200).json({
            idPatient:req.userId,
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
        res.status(200).json({message:"its ok"})
    })
}