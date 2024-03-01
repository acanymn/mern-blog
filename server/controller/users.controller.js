import HttpError from "../models/error.model.js";
import userModel from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER NEW USER
// POST: api/users/register
// UNPROTECTED
export const registerUser = async (req,res,next) => {

    try {
        const {name,email, password, password2} = req.body;
        if(!name || !email || !password){
            return next(new HttpError("Fill all fields",422));
        }
        const newEmail = email.toLowerCase();
        const emailExits = await userModel.findOne({email:newEmail});
        
        if(emailExits){
            return next(new HttpError("Email already in use!",422));
        }

        if((password.trim()).length < 6) {
            return next(new HttpError("Password lenght must be longer than 6 characters!"));
        }

        if(password != password2){
            return next(new HttpError("Passwords must be same!",422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);
        const newUser = await userModel.create({name,email: newEmail, password: hashedPass,});
        res.status(201).json({message:`New user ${newUser.email} registered!`})
    } catch (error) {
        return next(new HttpError("User registiration failed!",422));
    }



};

// LOGIN A REGISTERED USER
// POST: api/users/login
// UNPROTECTED
export const loginUser = async (req,res,next) => {
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return next(new HttpError("Fill in all fields!", 422));
        }

        const newEmail = email.toLowerCase();
        
        const user = await userModel.findOne({email:newEmail});

        if(!user){
            return next(new HttpError("There is no email matches!", 422))
        }

        const comparepass = await bcrypt.compare(password,user.password);
        if(!comparepass){
            return next(new HttpError("Invalid password",422));
        }

        const {_id:id,name} = user;
        const token = jwt.sign({id,name},process.env.JWT_SECRET,{expiresIn:"1d"});

        res.status(200).json({token,id,name});
    } catch (error) {
        return next(new HttpError("Login failed.Check your credentials!",422));
    }
};
    
// USER PROFILE
// GET: api/users/:id
// PROTECTED
export const getUser = (req,res,next) => {
      
};
    
// CHANGE USER AVATAR (profile picture)
// POST: api/users/change-avatar
// PROTECTED
export const changeAvatar = (req,res,next) => {
    res.status(200).json({message:"Changing avatar!"})
};

// EDIT USER DETAILS (from profile)
// POST: api/users/edit-user
// PROTECTED
export const editUser = (req,res,next) => {
    res.status(200).json({message:"Edit user details!"})
};

// GET AUTHORS
// POST: api/users/authors
// UNPROTECTED
export const getAuthors = (req,res,next) => {
    res.status(200).json({message:"All authors get!"})
};
    
          
            
