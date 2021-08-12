const express =require("express")
const {body}= require("express-validator")

const router=express.Router()
const authControllers=require("../controllers/auth")

// /auth =>GET
router.get("/auth",authControllers.getAuth)

// /auth/logout =>post
router.post("/auth/logout",authControllers.postLogout)

// /auth =>Post
router.post("/auth/signin",
body('name','یوزنیم باید پر شود').notEmpty(),
body('doctor').notEmpty().withMessage('باید یکی از گزینه ها را انتخاب کنید'),
body('password',"پسورد باید بیشتر از 5 حرف باشد").isLength({min:5}),
authControllers.postSignin)

// /auth =>Post
router.post("/auth/signup",authControllers.postSignup)

module.exports=router