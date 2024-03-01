import express from "express";
import { editPost,deletePost,getCatPost,getPost,getPosts,getUsersPost,createPost } from "../controller/posts.controller.js";
import {AuthMiddleware} from "../middleware/auth.middleware.js";

const route = express.Router();

route.post("/",AuthMiddleware,createPost);
route.get("/",getPosts);
route.get("/:id",getPost);
route.get("/categories/:category",getCatPost);
route.get("/users/:id",getUsersPost);
route.patch("/:id",AuthMiddleware,editPost);
route.delete("/:id",AuthMiddleware,deletePost);

export default route;