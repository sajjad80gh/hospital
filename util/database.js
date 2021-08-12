const mysql2=require("mysql2")
const pool=mysql2.createPool({
    host:"localhost",
    user:"root",
    password:"13800916",
    database:"hospital",
})
module.exports=pool.promise()