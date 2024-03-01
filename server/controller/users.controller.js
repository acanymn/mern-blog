import HttpError from "../models/error.model.js";
import userModel from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
export const getUser = async (req,res,next) => {
    try {

        const {id} = req.params;
        const user = await userModel.findById(id).select("-password");

        if(!user){
            return next(new HttpError("User cannot found!", 422));
        }

        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error))
    }
};
    
// CHANGE USER AVATAR (profile picture)
// POST: api/users/change-avatar
// PROTECTED
export const changeAvatar = async (req,res,next) => {
    try {
        if(!req.files.avatar){
            return next(new HttpError("Choose an image.",422));
        }

        const user = await userModel.findById(req.user.id);
        if(user.avatar){
            fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
                if(err){
                    return next(new HttpError(err))
                }
            })
        }

        const {avatar} = req.files;

        if(avatar.size > 500000){
            return next(new HttpError("Profile picture is too big. Should be less then 500kb.",422));
        }

        let fileName;
        fileName = avatar.name;
        let splittedFilename = fileName.split(".");
        let newFileName = splittedFilename[0] + uuidv4() + "." + splittedFilename[splittedFilename.length - 1] ;
        avatar.mv(path.join(__dirname,"..","uploads",newFileName), async (err) => {
            if(err){
                return next(new HttpError(err))
            }

            const updatedAvatar = await userModel.findByIdAndUpdate(req.user.id, {avatar:newFileName}, {new:true});
            if(!updatedAvatar){
                return next(new HttpError("Avatar could not changed!",422))
            }
            res.status(200).json(updatedAvatar);
        })
    } catch (error) {
        return next(new HttpError(error))
    }
};

// EDIT USER DETAILS (from profile)
// POST: api/users/edit-user
// PROTECTED
export const editUser = async (req,res,next) => {
    try {
        const {name,email,currentPassword,newPassword,confirmNewPassword} = req.body;
        if(!email || !name || !currentPassword || !newPassword || !confirmNewPassword){
            return next(new HttpError("Fill al fields!",422))
        }

        const user = await userModel.findById(req.user.id);
        if(!user){
            return next(new HttpError("User not found!",403));
        }

        //contiunes from here vid: 04:18:33

    } catch (error) {
        return next(new HttpError(error))
    }
};

// GET AUTHORS
// POST: api/users/authors
// UNPROTECTED
export const getAuthors = async (req,res,next) => {
    try {
        const authors = await userModel.find().select("-password");
        res.status(200).json(authors);
    } catch (error) {
        return next(new HttpError(error))
    }
};
    
          
            
