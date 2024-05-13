const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { isEmail } = require('validator');
const { text } = require('body-parser');

const userSchema = new mongoose.Schema(
    {
        surName: {
            type: String,
            require: true,
            minLength: 5,
            maxLength: 50,
            trim: true,
            unique: true
        },
        profilImage: {
            type: String,
            default: "/images/profils/ramdon-image.png"
        },
        email: {
            type: String,
            require: true,
            validate: [isEmail],
            lowerCase: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
            
        },
        friends: {
            type: [String]
        },
        messages: {
            type: [
                {
                    senderId: String,
                    sender: String,
                    text: String,
                    timestamp: Number,
                    isRead:Boolean,
                }
            ],
            required:true,
        },
        score:{
            type:[
                {
                    categorieName:String,
                    level:Number,
                }
            ],
            default: []
        },
        online: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true,
    }
);
// la fonction a executer avant la creation d'un utilisateur
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.statics.login = async function (email, mdp) {
    const user = await this.findOne({ email });
    console.log("Ceux du client" + email + mdp)
    if (user) {
        console.log(user.surName+" "+ user.email + " "+ user.password)
        const auth = await bcrypt.compare(mdp, user.password);
        console.log(auth)
        if (auth) {
            console.log("Oui")
            // Mettre à jour le champ 'online' à true
            await this.updateOne({ email }, { $set: { online: true } });
            return user;
        } throw Error("password error")

    } throw Error(" email error");
}
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;