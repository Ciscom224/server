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
            max: 1024,
            minLength: 7,
            maxLength: 65
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
userSchema.statics.login = async function (email, password) {
    console.log("Email : "+ email)
    console.log("Password envoyé : "+ password)
    const user = await this.findOne({ email });
    if (user) {
        console.log(user)
        await bcrypt.compare(password, user.password , async function (err, result) {
            console.log("Le résultat "+result)
            if (err) {
                console.log("Mauvais")
                throw Error("password error")
            }
            console.log("Bon")
            await this.updateOne({ email }, { $set: { online: true } });
            return user;
        });

    } throw Error(" email error");
}
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;