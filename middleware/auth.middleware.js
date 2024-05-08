const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

module.exports.verifyUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                // res.cookie('jwt', '', { maxAge: 1 });
                next();
            }
            else {
                let user = await UserModel.findById(decodedToken.id).select('-password');
                res.locals.user =user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

// La toute premiere connexion de la utilisateur 
module.exports.requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => { 
            if(err){
                console.log(err)
                res.status(200).send("No Token");
            }
            else{
                console.log(decodedToken.id)
                next()
            }
        })
    }else res.status(200).send("No Token")

}