const mongoose =require("mongoose")

mongoose.connect(
    "mongodb+srv://"+process.env.DB_USER_PASSWORD+"@aws.lelmj2i.mongodb.net/db_aws",

).then(()=>{
    console.log("BD MongDB connectee ...")
}).catch((err)=>{
    console.log("erreur de connexion du DB: ",err)
})