const db =require("../util/database")

module.exports= class comments{
    constructor(idpatinet,text){
        this.idpatinet=idpatinet
        this.text=text
    }
    save(){
        return db.query("INSERT INTO comments (idpatient,text) VALUES (?,?)",[
            this.idpatinet,
            this.text
        ])
    }

    static findByIdPatient(id){
        return db.query("SELECT d.username as doctorUsername,p.username as usernamePatient,c.idpatient as idrequestp,c.text,cc.text as reply,c.idrequest, c.date,cc.date as responseDate FROM (((patient p INNER JOIN comments c ON c.idpatient = p.idpatient) LEFT JOIN comments cc ON c.idrequest = cc.parentid)LEFT JOIN doctor d ON cc.iddoctor = d.iddoctor)  WHERE c.idpatient =?  ORDER BY c.date DESC",[id])
    }

    static findAllComments(){
        return db.query(`
        SELECT p.username as usernamePatient,c.idpatient as idrequestp,c.text,c.idrequest, c.date
        FROM (patient p INNER JOIN comments c ON c.idpatient = p.idpatient)
        where c.parentid IS NULL`)
    }
    static findReply(id){
        return db.query(`SELECT c.idrequest as replyid,c.parentid as replyto,d.username as doctorUsername,c.text as reply,c.date as responseDate 
        FROM (comments c LEFT JOIN doctor d ON c.iddoctor = d.iddoctor )
        where c.parentid = ?`,[id])
    }

    static insertReply(idParent,idDoctor,text){
        return db.query(`INSERT INTO comments (parentid,iddoctor,text) VALUES (?,?,?)`,
        [idParent,idDoctor,text])
    }
}
