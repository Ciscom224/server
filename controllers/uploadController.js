const UserModel = require("../models/user.model");
const objID = require('mongoose').Types.ObjectId;
const fs = require("fs");
const path = require("path");
const { uploadErrors } = require("../utils/errors.utils");

module.exports.uploadProfil = async (req, res) => {
    console.log(__dirname)
    const { id } = req.params;
    const { image } = req.body;
    if (!objID.isValid(id))
        return res.status(400).send("ID inconnu : " + id);
    try {
   

        if (!image) {
            throw new Error("Aucune image trouvée dans la requête.");
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé." });
        }

        // le nom et le chemin d'acces du dossier du client 
        const fileName = `${user.surName}.jpeg`;
        const imagePath = path.join(__dirname, `../../client/public/images/Profils/${fileName}`);

        // ajout dans chez le client 
        fs.writeFileSync(imagePath, image, 'base64');

        // Mise à jour du chemin de l'image dans le modèle d'utilisateur
        user.profilImage = image ;

        const updatedUser = await user.save();

        res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error("Erreur lors de l'upload de l'image :", error);
        const errors = uploadErrors(error);
        res.status(400).json({ errors });
    }
};
