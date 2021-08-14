const express=require("express")
const router =express.Router()
const adminControllers=require("../controllers/admin")
const isAdmin=require("../midlewere/auth")

router.get("/",adminControllers.getAdmin)
router.get("/panel",isAdmin.isAdmin,adminControllers.getPanel)
router.get("/patient",isAdmin.isAdmin,adminControllers.getPatient)
router.get("/doctor",isAdmin.isAdmin,adminControllers.getDoctor)
router.get("/download",isAdmin.isAdmin,adminControllers.getDownload)

router.post("/panel",isAdmin.isAdmin,adminControllers.postSignAdmin)
router.post("/",adminControllers.postLoginAdmin)
router.post("/removePatient",isAdmin.isAdmin,adminControllers.postRemove)
router.post("/removeDoctor",isAdmin.isAdmin,adminControllers.postRemove)

module.exports=router