//Pp

import postModel from "../models/posts.model.js"
import userModel from "../models/users.model.js"
import fs from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import HttpError from "../models/error.model.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

//====== CREATE A POST
//POST: api/posts
//Protected
export const createPost = (req,res,next) => {
    try {
        
        let {title, category, description} = req.body;
        if(!title || !category || !description || !req.files){
            
            return next(new HttpError("Fill all fileds and choose a thumbnail!"))
        } 
        
        let {thumbnail} = req.files;

        if(thumbnail.size > 2000000){
            return next(new HttpError("Thumbnail too big. Must be less then 2mb."))
        }

        let fileName = thumbnail.name;
        let splittedFilename = fileName.split(".");
        let newFileName = splittedFilename[0] + uuidv4() + "." + splittedFilename[splittedFilename.length - 1];
        thumbnail.mv(path.join(__dirname, "..", "/uploads", newFileName), async (err) => {
            
            if(err){
                return next(new HttpError(err));
            } else {
                const newPost = await postModel.create({title,category, description, thumbnail: newFileName, creator: req.user.id});
            
                if(!newPost){
                    
                    return next(new HttpError("Post could not be created!", 422));
                }
  
                const currentUser = await userModel.findById(req.user.id);
                const userPostCount = currentUser.posts + 1;
                await userModel.findByIdAndUpdate(req.user.id, {posts: userPostCount});

                res.status(201).json(newPost);
            }

        })

    } catch (error) {
        return next(new HttpError(error))
    }
};


//====== GET ALL POST
//GET: api/posts
//UNProtected
export const getPosts = async (req,res,next) => {
    try {
        const posts = await postModel.find().sort({updatedAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error));
    }
};


//====== GET SINGLE POST
//GET: api/posts/:id
//unProtected
export const getPost = async (req,res,next) => {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if(!post){
            return next(new HttpError("Post not found!",404))
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error))
    }
};


//====== GET POSTS BY CATEGORY
//GET: api/posts/categories/:category
//unProtected
export const getCatPost = async (req,res,next) => {
    try {
        const {category} = req.params;
        const posts = await postModel.find({category}).sort({updatedAt: -1});
        if(!posts){
            return next(new HttpError("Post not found!",404))
        } 
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error))
    }
};


//====== GET POSTS BY AUTHORS
//GET: api/posts/users/:id
//UNProtected
export const getUsersPost = async (req,res,next) => {
    try {
        
        const {id} = req.params;
        const posts = await postModel.find({creator:id}).sort({updatedAt: -1});
        if(!posts){
            return next(new HttpError("Post not found!",404));
        }

        res.status(200).json(posts);

    } catch (error) {
        return next(new HttpError(error));
    }
};


//====== EDIT POSTS
//PATCH: api/posts/:id
//Protected
export const editPost = async (req,res,next) => {
    try {
        let fileName;
        let newFileName;
        let updatedPost;
        const postId = req.params.id;
        let {title,category,description} = req.body;

        if(!title || !category || description.length < 12) {
            return next(new HttpError("Fill all the fields.",422));
        }

        if(!req.files){
            updatedPost = await postModel.findByIdAndUpdate(postId, {title,category,description}, {new:true});
        } else{
            const oldPost = await postModel.findById(postId);
            fs.unlink(path.join(__dirname, "..", "uploads", oldPost.thumbnail), async (err) => {
                if(err){
                    return next(new HttpError(err))
                }
            });
        }

        const {thumbnail} = req.files;

        if(thumbnail.size > 2000000){
            return next(new HttpError("Thumbnail is too big. Should be less than 2mb."))
        }

        fileName = thumbnail.name;
        let splittedFilename = fileName.split(".");
        newFileName = splittedFilename[0] + uuidv4()+ "." + splittedFilename[splittedFilename.length - 1];
        thumbnail.mv(path.join(__dirname, "..", "uploads", newFileName), async (err) => {
            if(err){
                return next(new HttpError(err))
            }
        })

        updatedPost = await postModel.findByIdAndUpdate(postId, {title,category,description,thumbnail: newFileName}, {new:true});

        if(!updatedPost){
            return next(new HttpError("Error! Post cannot updated!", 422));
        }

        res.status(200).json(updatedPost);

    } catch (error) {
        return next(new HttpError(error))
    }
};


//====== DELETE POSTS
//DELETE: api/posts/:id
//Protected
export const deletePost = (req,res,next) => {
    res.json("delete Post")
};



