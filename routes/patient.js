const express=require("express")
const router=express.Router()

const patientControllers=require('../controllers/patient')

// /patient/panel => POST
router.post("/panel",patientControllers.postPanel)

// /patient/request => POST
router.post("/request",patientControllers.postRequest)

// /patient/panel => get
router.get("/panel",patientControllers.getPanel)

// /patient/request => get
router.get("/request",patientControllers.getRequest)


module.exports=router