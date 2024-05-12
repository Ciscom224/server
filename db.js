const mongoose =require("mongoose")

mongoose.connect(
    "mongodb+srv://"+process.env.DB_USER_PASSWORD+"@aws.iyfrll2.mongodb.net/",

).then(()=>{
    console.log("BD MongDB connectee ...")
}).catch((err)=>{
    console.log("erreur de connexion du DB: ",err)
})