//validate incoming tokens


const jwt = require('jsonwebtoken');


module.exports = (req,res,next) => {

    const authHeader = req.get('Authorization');
    if(!authHeader) {

        const error = new Error('not authenticated');
        error.statusCode = 401;
        throw error;

    }

    //extract the header token
    const token = req.get('Authorization').split(' ')[1];

    //try to decode that!

    try {

        decodedToken = jwt.verify(token,'supersecretstring');

        //verify decodes and verifies a token!

    } catch(err) {

        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken) {
        //did not fail but was unable to verify token!

        const error = new Error('not authenticated!');

    }

    //if we passed, means we have a verified token
    //we need to extract info from token
    //like user id to use it in other places

    req.userId = decodedToken.userId;

    next();


}