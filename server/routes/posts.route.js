import express from "express";

const route = express.Router();

route.get("/",(req,res,next) => {
    res.status(200).json({message:"This is post route!"})
})

export default route;