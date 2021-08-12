const db=require("../util/database")

class doctor {
    constructor(name ,password,imgSrc,proficiency,evidence){
        this.name=name
        this.proficiency=proficiency
        this.imgSrc=imgSrc
        this.evidence=evidence
        this.password=password
        console.log(this.imgSrc)

    }
    save(){
        return db.query("INSERT INTO doctor (username,password,image,madrak,takhasos) VALUES (?,?,?,?,?)",[
            this.name,
            this.password,
            this.imgSrc,
            this.evidence,
            this.proficiency,
            ])
    }
    
    static updateById(id,name,proficiency,evidence,image){
        return db.query('UPDATE doctor SET username=?,madrak=?,takhasos=?,image=? WHERE iddoctor = ?',[
            name,
            evidence,
            proficiency,
            image,
            id
        ])
    }
    
    static findByUsername(username){
        return db.query("SELECT * FROM doctor WHERE doctor.username = ?",
        [username])
    }
    static findById(id){
        return db.query("SELECT * FROM doctor WHERE doctor.iddoctor = ?",
        [id])
    }
    static findAll(skip=0,limit=1){
        return db.query("SELECT takhasos,madrak,username,image,iddoctor as id FROM doctor LIMIT ? OFFSET ? ",
        [limit,skip])
    }
    
    static removeById(id){
        return db.query("DELETE FROM doctor WHERE iddoctor =?",[id])
    }
}
module.exports=doctor