const UserModel = require('../models/user.model');
const objID = require('mongoose').Types.ObjectId;

module.exports.getUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
};


module.exports.user = async (req, res) => {

    if (!objID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id);

    try {
        const user = await UserModel.findById(req.params.id).select('-password');
        res.send(user);
    } catch (error) {
        console.log("ID inconnu : ", req.params.id);
        res.status(500).send("Erreur lors de la recherche de l'utilisateur");
    }
}

module.exports.updateUser = async (req, res) => {

    if (!objID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id);

    console.log("changement de joueur");
}

module.exports.deleteUser = async (req, res) => {
    if (!objID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id);

    try {
        await UserModel.findOneAndDelete({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Suppression reussit !!!" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// Methode pour ajouter un ami a un utilisateur
module.exports.addFriend = async (req, res) => {


    try {
        // verification des ids
        if (!objID.isValid(req.params.id) || !objID.isValid(req.body.idFriend))
            return res.status(400).send("ID inconnu ");
        // Ajout dans la liste Friends
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { friends: req.body.idFriend } },
            { new: true, upsert: true }
        ).exec();

        // Vérification si l'utilisateur a été mis à jour
        if (updatedUser) {
            res.status(200).json({ user: updatedUser });
        } else {
            res.status(400).json({ message: "Utilisateur non trouvé" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}
// Methode pour la suppression d'un dans la liste d'amis d'un utilisateur

module.exports.delFriend = async (req, res) => {

    try {
        // verification des ids
        if (!objID.isValid(req.params.id) || !objID.isValid(req.body.idFriend))
            return res.status(400).send("ID inconnu ");

        const deletedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { friends: req.body.idFriend } },
            { new: true, upsert: true }
        ).exec();

        // Vérification de la suppression
        if (deletedUser) {
            res.status(200).json({ user: deletedUser });
        } else {
            res.status(400).json({ message: "Utilisateur non trouvé" });
        }

    } catch (error) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }



}
module.exports.sendMessage = async (req, res) => {

    if (!objID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id);

    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $push: {
                    messages: {
                        senderId: req.body.userId,
                        sender: req.body.userName,
                        text: req.body.text,
                        isRead: false,
                        timestamp: Date.now()
                    }
                }
            },
            { new: true }
        );

        if (updatedUser) {
            return res.send("Message envoye");
        } else {
            return res.status(404).send("Utilisateur non trouvé");
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

module.exports.updateMessage = async (req, res) => {

    if (!objID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);

    try {

        const user = await UserModel.findById(req.params.id);

        if (!user) 
            return res.status(404).send("Utilisateur non trouvé");

        const message = user.messages.find((edit) =>
            edit._id.equals(req.body.messageId)
        );

        if (!message) 
            return res.status(404).send("Message non trouvé");
        message.text = req.body.text;
        await user.save();

        return res.status(200).send(user);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

module.exports.removeMessage = (req, res) => {

}
module.exports.updateScore = async (req, res) => {
    if (!objID.isValid(req.params.id))
        return res.status(400).send("ID inconnu : " + req.params.id);

    try {
        const { categorie, level } = req.body;

        let user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).send("Utilisateur non trouvé");
        }

        // cherche de la categorie
        const currentScore = user.score.findIndex(score => score.categorieName === categorie);

        if (currentScore !== -1) {
            
            user.score[currentScore].level = level;
        } else {
            user.score.push({ categorieName: categorie, level: level });
        }
        user = await user.save();

        return res.send("le score a ete modifier " + categorie);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};
module.exports.getBestPayers=async (req,res) => {

    console.log("bienvenue ! ")
    res.status(400).send("error !!!");
}
