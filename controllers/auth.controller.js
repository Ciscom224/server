const UserModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');

const maxDate =24 * 60 * 60 * 1000

// fonction pour la creation du token 
const createToken=(id)=>{

    return jwt.sign({id},process.env.TOKEN_SECRET,{
        expiresIn: maxDate, 
    })
} 
module.exports.signUp = async (req,res) =>{
    
    const {surName,email,password}=req.body
    console.log("Le password de connection"+password)
    await UserModel.collection.dropIndexes();
    try {
        const realPassword = await password.trim();
        const user= await  UserModel.create({surName,email,password:realPassword})
        console.log("Bon")
        res.status(201).json({user:user._id})
    } catch (error) {
        const errors=signUpErrors(error)
        console.log("Mauvais")
        res.status(200).send({errors});  
    }
}
module.exports.signIn=async (req,res)=>{
    
    const {email,password}=req.body;

    try {
        const user= await UserModel.login(email.trim(),password.trim());
        const token=createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,sameSite: 'None',secure:true,maxAge:maxDate}) // ajout du token JWT dans le cookie
        res.status(201).send(user)
    } catch (err) {
        const errors=signInErrors(err)
        res.status(200).send(errors)
    }

}
module.exports.logout= async (req,res)=>{

   await UserModel.updateOne({ _id: res.locals.user._id }, { $set: { online: false } });
   res.cookie('jwt',"",{httpOnly:true,sameSite: 'None',secure:true,maxAge:1}) // ajout du token JWT dans le cookie

   res.status(201).send({message:"vous vous etes deconnecter"})
}
