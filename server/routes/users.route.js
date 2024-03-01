import express from "express";
import { registerUser,loginUser,getUser,changeAvatar,editUser,getAuthors } from "../controller/users.controller.js";

const route = express.Router();

route.post("/register", registerUser);
route.post("/login", loginUser);
route.patch("/edit-user", editUser);
route.get("/authors", getAuthors);
route.post("/change-avatar", changeAvatar);
route.get("/:id", getUser);


export default route;