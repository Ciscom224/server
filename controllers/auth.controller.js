const UserModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');
const bcrypt = require('bcrypt');

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
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error("email error");
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            throw new Error("password error");
        }

        // Mettre à jour le champ 'online' à true
        await UserModel.updateOne({ email }, { $set: { online: true } });

        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: maxDate });
        res.status(201).send(user);
    } catch (err) {
        const errors = signInErrors(err);
        res.status(200).send(errors);
    }

}
module.exports.logout= async (req,res)=>{

   await UserModel.updateOne({ _id: res.locals.user._id }, { $set: { online: false } });
   res.cookie('jwt',"",{httpOnly:true,sameSite: 'None',secure:true,maxAge:1}) // ajout du token JWT dans le cookie
   res.status(201).send({message:"vous vous etes deconnecter"})
}
