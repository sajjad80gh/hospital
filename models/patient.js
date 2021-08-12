const db = require("../util/database")

module.exports=class patient{
    constructor(username,password,age,isman){
        this.username=username
        this.password=password
        this.age=age
        this.isman=isman
    }
    save(){
        return db.query("INSERT INTO patient (username,password,age,isman) VALUES (?,?,?,?)"
        ,[this.username,this.password,this.age,this.isman])
    }

    static updateById(id,name,age,isman){
        return db.query('UPDATE patient SET username=?,isman=?,age=? WHERE patient.idpatient = ?',[
            name,
            isman,
            age,
            id
        ])
    }
    static findOneByUsername(username){
        return db.query("SELECT * FROM patient  WHERE patient.username = ?"
        ,[username])
    }
    static findById(idpatient){
        return db.query("SELECT * FROM patient  WHERE patient.idpatient = ?"
        ,[idpatient])
    }
    static findAll(skip=0,limit=1){
        return db.query("SELECT isman,age,username,idpatient as id FROM patient LIMIT ? OFFSET ? ",
        [limit,skip])
    }
    
    static removeById(id){
        return db.query("DELETE FROM patient WHERE idpatient =?",[id])
    }
}