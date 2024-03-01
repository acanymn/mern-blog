// Unspported (404) routes

export const notFound = (req,res,next) => {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404);
    next(error);
}


//Middleware to handle errors

export const errorHandler = (error,req,res,next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500).json({message: error.message || "An unknown error occured!"})
}

