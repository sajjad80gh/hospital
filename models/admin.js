const db =require("../util/database")

class admin{
    constructor(username,password){
        this.username=username
        this.password=password
    }


    save(){
        return db.query(`INSERT INTO admins (username,password) VALUES (?,?) `,
        [this.username,this.password])
    } 
    
    static findByUsername(username){
        return db.query(`SELECT * FROM admins WHERE  admins.username = ?`,
        [username])
    }
}
module.exports=admin