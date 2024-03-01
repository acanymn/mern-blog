import jwt from "jsonwebtoken";
import HttpError from "../models/error.model.js";

export const AuthMiddleware = async (req,res,next) => {
    const Authorization =  req.headers.Authorization || req.headers.authorization;
    if(Authorization && Authorization.startsWith("Bearer")){
        const token = Authorization.split(' ')[1];
        jwt.verify(token,process.env.JWT_SECRET, (err,info) =>{
            if(err){
                return next(new HttpError("Authorization not valid. Unauthorized.",403));
            }

            req.user = info;
            next()
        });
    }else{
        return next(new HttpError("Unauthorized. Not valid token."))
    }
};