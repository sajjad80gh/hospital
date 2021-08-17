const bcrypt=require("bcryptjs")
const {validationResult}=require("express-validator")
const jwt=require("jsonwebtoken")

const usersdb=require("../models/users")

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
            res.status(201).json({
                message:"new user create",
                userid:result._id
            })
        }).catch((err)=>{
            if(err.code==11000){
                res.json({
                    message:"this username already is used"
                })
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
        res.status(422).json({
            message:err
        })  
    }

    usersdb.findOne({username:req.body.name})
    .then((document)=>{
        if(document !==null){
            bcrypt.compare(req.body.password,document.password)
            .then(isOk=>{
                if(isOk){
                    const token=jwt.sign(
                    {
                        type:req.body.type,
                        username:document.username,
                        id:document._id
                    },
                        "secret",
                        {expiresIn:"2h"})
                    res.status(200).json({
                        token:token
                    })
                }else{
                    res.status(422).json({
                        message:"username or password not curent"
                    })                    
                }
            })
        }else{
            res.status(422).json({
                message:"username or password not curent"
            })
        }
    })
}