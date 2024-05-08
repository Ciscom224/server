const UserModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');

const maxDate =1 * 60 * 60 * 1000

// fonction pour la creation du token 
const createToken=(id)=>{

    return jwt.sign({id},process.env.TOKEN_SECRET,{
        expiresIn: maxDate, 
    })
} 
module.exports.signUp = async (req,res) =>{
    
    const {surName,email,password}=req.body
    try {
        const user= await  UserModel.create({surName,email,password})
        res.status(201).json({user:user._id})
    } catch (error) {
        const errors=signUpErrors(error)
        res.status(200).send({errors});  
    }
}
module.exports.signIn=async (req,res)=>{
    
    const {email,password}=req.body;

    try {
        const user= await UserModel.login(email,password);
        const token=createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,sameSite: 'None'}) // ajout du token JWT dans le cookie
        res.status(201).send(user)
    } catch (err) {
        const errors=signInErrors(err)
        res.status(200).send(errors)
    }

}
module.exports.logout= async (req,res)=>{

   await UserModel.updateOne({ _id: res.locals.user._id }, { $set: { online: false } });
   res.cookie('jwt','',{maxAge: 1 }); //suppression du token JWT dans le cookie  
   res.status(201).send({message:"vous vous etes deconnecter"})
}
