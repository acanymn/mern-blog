import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import env from "dotenv";
import usersRoute from "./routes/users.route.js";
import postsRoute from "./routes/posts.route.js";
import { notFound,errorHandler } from "./middleware/error.middleware.js";

env.config();
const app = express();

app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors({credentials:true, origin:"http://localhost:3000"}));

app.use("/api/users",usersRoute);
app.use("/api/posts",postsRoute);

app.use(notFound);
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URL).then(app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
})).catch(error => {console.log(error)})











