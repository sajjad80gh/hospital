const mongoose =require("mongoose")
const schema =mongoose.Schema

const comments=new schema({
    id:{
        type: schema.Types.ObjectId,
        ref:"User"
    },
    text:String,
    created:{
        type:Date,
        default:Date.now
    },
    reply:[
        new schema({
            id:{
                type: schema.Types.ObjectId,
                ref:"User"
            },
            text:String,
            created:{
                type:Date,
                default:Date.now
            },
        })
    ]
})

module.exports=mongoose.model("Comments",comments)