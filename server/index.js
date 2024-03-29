import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import env from "dotenv";
import usersRoute from "./routes/users.route.js";
import postsRoute from "./routes/posts.route.js";
import { notFound,errorHandler } from "./middleware/error.middleware.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import upload from "express-fileupload";

env.config();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));


app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors({credentials:true, origin:"http://localhost:3000"}));
app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));


app.use("/api/users",usersRoute);
app.use("/api/posts",postsRoute);

app.use(notFound);
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URL).then(app.listen(process.env.PORT || 2874, () => {
    console.log(`Server running on ${process.env.PORT}`);
})).catch(error => {console.log(error)})











