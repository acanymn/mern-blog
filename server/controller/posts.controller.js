//Pp

//====== CREATE A POST
//POST: api/posts
//Protected
export const createPost = (req,res,next) => {
    res.json("create Post")
};


//====== GET ALL POST
//GET: api/posts
//UNProtected
export const getPosts = (req,res,next) => {
    res.json("Get ALL Post")
};


//====== GET SINGLE POST
//GET: api/posts/:id
//unProtected
export const getPost = (req,res,next) => {
    res.json("get single Post")
};


//====== GET POSTS BY CATEGORY
//GET: api/posts/categories/:category
//unProtected
export const getCatPost = (req,res,next) => {
    res.json("get osts by category")
};


//====== GET POSTS BY AUTHORS
//GET: api/posts/users/:id
//UNProtected
export const getUsersPost = (req,res,next) => {
    res.json("get Post by authors")
};


//====== EDIT POSTS
//PATCH: api/posts/:id
//Protected
export const editPost = (req,res,next) => {
    res.json("edit Post")
};


//====== DELETE POSTS
//DELETE: api/posts/:id
//Protected
export const deletePost = (req,res,next) => {
    res.json("delete Post")
};



