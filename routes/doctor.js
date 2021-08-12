const express=require("express")
const router=express.Router()

const doctorControllers=require("../controllers/doctor")

// /doctor/panel => get
router.get("/panel",doctorControllers.getPanel)

// /doctor/panel => POST
router.post("/panel",doctorControllers.postPanel)


// /doctor/patient => get
router.get("/patient",doctorControllers.getPatient)

// /doctor/patient => post
router.post("/patient",doctorControllers.postPatient)

module.exports=router