const UserModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
const bcrypt = require("bcrypt")
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
    try {
        // const user= await  UserModel.create({surName,email,password})
        console.log(password)
        const salt=await bcrypt.genSalt();
        const passwordHash= await bcrypt.hash(password, salt);
        console.log(passwordHash)
        const newUser = new UserModel({surName,password:passwordHash,email});
        await newUser.save();
        res.status(201).json({user:newUser._id})
    } catch (error) {
        const errors=signUpErrors(error)
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
   await res.cookie('jwt',"",{httpOnly:true,sameSite: 'None',secure:true,maxAge:1})
   res.status(201).send({message:"vous vous etes deconnecter"})
}
