import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    category: {type: String, enum:["Agriculture","Business","Education","Entertainment","Art","Investment","Uncategorised","Weather"], message:"Value is not supported!"},
    description: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    thumbnail: {type: String, required: true},
}, {timestamps:true});

const postModel = mongoose.model("Post",postSchema);
export default postModel;