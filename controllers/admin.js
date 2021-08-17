const bycrypt=require("bcryptjs")
const usersdb=require("../models/users")
const path =require("path")
const jwt=require("jsonwebtoken")

exports.getPatient=(req,res,next)=>{
    let page=req.query.page?Number(req.query.page):1
    if(!(typeof page == "number" && page > 0)){
        page=1
    }
    usersdb.find({patient:true})
    .skip(page*5).limit(5)
    .then(result=>{
        res.json({
            users:result,
            page:Number(page)
        })
    })
}

exports.getDoctor=(req,res,next)=>{
    let page=req.query.page?Number(req.query.page):1
    if(!(typeof page == "number" && page > 0)){
        page=1
    }
    usersdb.find({patient:false})
    .skip(page*5).limit(5)
    .then(result=>{
        res.json({
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
            res.json({error:"username or password not current"})
            return next()
        }
        if(document.admin !== undefined && document.admin){
            bycrypt.compare(req.body.password,document.password)
            .then(ok=>{
                if(ok){
                    const token=jwt.sign({
                        username:document.username,
                        id:document._id,
                        type:req.body.type,
                    },"secret",{expiresIn:"2h"})
                    res.status(200).json({token:token})
                }else{
                    return res.status(244).json({error:"username or password not current"})
                }
            })
        }else{
            return res.status(244).json({error:"username or password not current"})
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
            res.json({message:"save the user is ok"})
        })
    })
    
}

exports.postRemove=(req,res,next)=>{
    usersdb.findOneAndDelete(req.body.id)
    .then((result)=>{
        res.json({message:"user was deleted"})
    })
}