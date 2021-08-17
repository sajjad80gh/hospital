const jwt =require("jsonwebtoken")

function checkLogin(req){
    const authHeader=req.get("Authorization")
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token=authHeader.split(" ")[1]
    let decoded;
    try{
        decoded=jwt.decode(token,"secret")
    }
    catch(err){
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
      req.userId = decodedToken.userId;
      return decodedToken;
}
exports.isPatient=(req,res,next)=>{
    const decodeData=checkLogin(req)
    if(decodeData.type!=="patient"){
        const error = new Error('Not authenticated. you not accses ');
        error.statusCode = 401;
        throw error;
    }
    next();
}
exports.isDoctor=(req,res,next)=>{
    const decodeData=checkLogin(req)
    if(decodeData.type!=="doctor"){
        const error = new Error('Not authenticated. you not accses ');
        error.statusCode = 401;
        throw error;
    }
    next();
}
exports.isAdmin=(req,res,next)=>{
    const decodeData=checkLogin(req)
    if(decodeData.type!=="admin"){
        const error = new Error('Not authenticated. you not accses ');
        error.statusCode = 401;
        throw error;
    }
    next();
}